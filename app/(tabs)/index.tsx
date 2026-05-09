import FloatingButton from "@/components/FloatingButton";
import { PinIcon } from "@/components/icons/PinIcon";
import { RouteIcon } from "@/components/icons/RouteIcon";
import MapMenuPill from "@/components/MapMenuPill";
import MapOptionsDrawer, { MapOptions } from "@/components/MapOptionsDrawer";
import { PlaceInput, PlaceSelection } from "@/components/PlaceInput";
import PlayerHUD from "@/components/PlayerHUD";
import { apiFetch } from "@/constants/api";
import { darkMapStyle, lightMapStyle } from "@/constants/mapStyle";
import { colors, colorTokens, fontFamily } from "@/constants/tokens";
import { useAuth } from "@/context/AuthContext";
import { useTiledSoundData } from "@/hooks/useTiledSoundData";
import * as Location from "expo-location";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polygon, Polyline, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ClipPath, Defs, G, Path, Svg } from "react-native-svg";
import { buildHexGrid, hexVertices, latLngToHexKey } from "../../utils/hexGrid";
import { getCellSize, getZoomLevel, weightToColor } from "../../utils/mapUtils";

type QuietRouteCandidate = {
  rank: number;
  label: string;
  distance_m: number;
  duration_sec: number;
  avg_db: number;
  loud_spots: number;
  quiet_score: number;
  cost: number;
  polyline: string;
  points: { lat: number; lng: number }[];
};

const INITIAL_REGION: Region = {
  latitude: 35.6812,
  longitude: 139.7671,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};
const INITIAL_CELL_SIZE = 0.00375;

// kumo.svg のパスデータ (viewBox 216x97)
const KUMO_PATH =
  "M186.628 0C202.699 0.000185223 215.727 13.0284 215.728 29.0996C215.728 45.171 202.699 58.2 186.628 58.2002H144.251C146.761 62.1201 148.216 66.7804 148.216 71.7803C148.216 85.7088 136.924 97 122.995 97H25.2197C11.2912 97 0.000147402 85.7088 0 71.7803C0 57.8517 11.2911 46.5596 25.2197 46.5596H50.8262C47.173 41.696 45.0078 35.6507 45.0078 29.0996C45.008 13.0283 58.0361 5.87859e-05 74.1074 0H186.628Z";
const KUMO_W = 216;
const KUMO_H = 97;

function seededRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const EDGE_NEIGHBORS: [number, number][] = [
  [0, 1],
  [-1, 1],
  [-1, 0],
  [0, -1],
  [1, -1],
  [1, 0],
];

type HexPolygonProps = {
  centerLat: number;
  centerLng: number;
  cellSize: number;
  weight: number;
  strokeColor: string;
};

const HexPolygon = React.memo(function HexPolygon({
  centerLat,
  centerLng,
  cellSize,
  weight,
  strokeColor,
}: HexPolygonProps) {
  const coordinates = useMemo(
    () => hexVertices(centerLat, centerLng, cellSize),
    [centerLat, centerLng, cellSize],
  );
  return (
    <Polygon
      coordinates={coordinates}
      fillColor={weightToColor(weight)}
      strokeWidth={0.5}
      strokeColor={strokeColor}
    />
  );
});

export default function App() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [cellSize, setCellSize] = useState(INITIAL_CELL_SIZE);
  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const [mapDims, setMapDims] = useState({ width: 0, height: 0 });
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [routeSearchVisible, setRouteSearchVisible] = useState(false);
  const [routeOrigin, setRouteOrigin] = useState<PlaceSelection>({ label: "現在地", location: null });
  const [routeDestination, setRouteDestination] = useState<PlaceSelection>({ label: "", location: null });
  const [routeMode, setRouteMode] = useState<"quiet" | "balanced" | "fast">("quiet");
  const [routeResults, setRouteResults] = useState<QuietRouteCandidate[] | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);
  const [mapOptions, setMapOptions] = useState<MapOptions>({
    showHexGrid: true,
    timeRange: [0, 24],
  });
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(
    null,
  );
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const showsExplorationMap = isDark;
  const showsGradientGrid = !isDark;
  const publicSoundData = useTiledSoundData(region, showsGradientGrid ? undefined : null);
  const explorationSoundData = useTiledSoundData(
    region,
    showsExplorationMap ? user?.user_id || null : null,
  );
  const filteredPublicSoundData = useMemo(() => {
    const [startHour, endHour] = mapOptions.timeRange;
    if (startHour <= 0 && endHour >= 24) return publicSoundData;
    return publicSoundData.filter((p) => {
      const hour = new Date(p.created_at).getHours();
      return hour >= startHour && hour < endHour;
    });
  }, [publicSoundData, mapOptions.timeRange]);
  const publicGrid = useMemo(
    () => buildHexGrid(filteredPublicSoundData, cellSize),
    [filteredPublicSoundData, cellSize],
  );
  const explorationGrid = useMemo(
    () => buildHexGrid(explorationSoundData, cellSize),
    [explorationSoundData, cellSize],
  );
  const grid = showsExplorationMap ? explorationGrid : publicGrid;

  // 描画する hex を viewport 内に限定 (off-screen の Polygon を作らない)
  const visibleGrid = useMemo(() => {
    if (!showsGradientGrid) return [];
    const padLat = cellSize * 2;
    const padLng = cellSize * 2.5;
    const minLat = region.latitude - region.latitudeDelta / 2 - padLat;
    const maxLat = region.latitude + region.latitudeDelta / 2 + padLat;
    const minLng = region.longitude - region.longitudeDelta / 2 - padLng;
    const maxLng = region.longitude + region.longitudeDelta / 2 + padLng;
    return publicGrid.filter(
      (c) =>
        c.centerLat >= minLat &&
        c.centerLat <= maxLat &&
        c.centerLng >= minLng &&
        c.centerLng <= maxLng,
    );
  }, [showsGradientGrid, publicGrid, region, cellSize]);

  const currentSizeRef = useRef(INITIAL_CELL_SIZE);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    let sub: Location.LocationSubscription | undefined;
    let alive = true;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!alive) return;
      if (status !== "granted") {
        setInitialRegion(INITIAL_REGION);
        return;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({});
        if (!alive) return;
        const coords = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        const userRegion: Region = {
          ...coords,
          latitudeDelta: INITIAL_REGION.latitudeDelta,
          longitudeDelta: INITIAL_REGION.longitudeDelta,
        };
        setUserCoords(coords);
        setRegion(userRegion);
        setInitialRegion(userRegion);
      } catch {
        if (alive) setInitialRegion(INITIAL_REGION);
      }

      if (!alive) return;
      const next = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 5,
        },
        (loc) => {
          if (alive) {
            setUserCoords({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            });
          }
        },
      );
      if (!alive) {
        next.remove();
        return;
      }
      sub = next;
    })();

    return () => {
      alive = false;
      void sub?.remove();
    };
  }, []);

  const handleRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
    const size = getCellSize(getZoomLevel(newRegion));
    if (Math.abs(size - currentSizeRef.current) / currentSizeRef.current < 0.05) return;
    currentSizeRef.current = size;
    setCellSize(size);
  };

  const handleOptionsChange = (next: Partial<MapOptions>) => {
    setMapOptions((prev) => ({ ...prev, ...next }));
  };

  const handleRouteSearch = async () => {
    const originLoc =
      routeOrigin.location ??
      (routeOrigin.label === "現在地" && userCoords
        ? { lat: userCoords.latitude, lng: userCoords.longitude }
        : null);
    const destLoc = routeDestination.location;

    if (!originLoc || !destLoc) {
      setRouteError("出発地と目的地を正しく選択してください");
      return;
    }

    setRouteError(null);
    setRouteLoading(true);
    setRouteResults(null);
    try {
      const res = await apiFetch<{ routes: QuietRouteCandidate[] }>("/routes/quiet", {
        method: "POST",
        body: JSON.stringify({ origin: originLoc, destination: destLoc, mode: routeMode }),
      });
      setRouteResults(res.routes);
      setSelectedRouteIdx(0);
      if (res.routes[0]?.points.length) {
        fitToRoute(res.routes[0].points);
      }
    } catch (e) {
      setRouteError(e instanceof Error ? e.message : "ルート取得に失敗しました");
    } finally {
      setRouteLoading(false);
    }
  };

  const fitToRoute = (points: { lat: number; lng: number }[]) => {
    mapRef.current?.fitToCoordinates(
      points.map((p) => ({ latitude: p.lat, longitude: p.lng })),
      { edgePadding: { top: 80, right: 40, bottom: 320, left: 40 }, animated: true },
    );
  };

  const handleRecenter = () => {
    if (!userCoords) return;
    mapRef.current?.animateToRegion(
      {
        ...userCoords,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta,
      },
      500,
    );
  };

  const exploredKeys = useMemo(() => new Set(grid.map((c) => c.key)), [grid]);

  // 大きな1枚の霧ポリゴンに探索済みセルを穴として切り抜く
  const fogOverlay = useMemo(() => {
    if (!showsExplorationMap) return null;
    const padLat = region.latitudeDelta * 5;
    const padLng = region.longitudeDelta * 5;
    return {
      outer: [
        { latitude: region.latitude + padLat, longitude: region.longitude - padLng },
        { latitude: region.latitude + padLat, longitude: region.longitude + padLng },
        { latitude: region.latitude - padLat, longitude: region.longitude + padLng },
        { latitude: region.latitude - padLat, longitude: region.longitude - padLng },
      ],
      holes: grid.map((cell) => hexVertices(cell.centerLat, cell.centerLng, cellSize)),
    };
  }, [showsExplorationMap, region, grid, cellSize]);

  // 霧と探索済みエリアの境界辺のみ Polyline で描画
  const boundaryEdges = useMemo(() => {
    if (!showsExplorationMap) return [];
    const edges: {
      key: string;
      coords: [{ latitude: number; longitude: number }, { latitude: number; longitude: number }];
    }[] = [];

    for (const cell of grid) {
      const [q, r] = cell.key.split(",").map(Number);
      const verts = hexVertices(cell.centerLat, cell.centerLng, cellSize);

      for (let i = 0; i < 6; i++) {
        const [dq, dr] = EDGE_NEIGHBORS[i];
        if (!exploredKeys.has(`${q + dq},${r + dr}`)) {
          edges.push({
            key: `e_${cell.key}_${i}`,
            coords: [verts[i], verts[(i + 1) % 6]],
          });
        }
      }
    }
    return edges;
  }, [showsExplorationMap, grid, exploredKeys, cellSize]);

  // lat/lng → SVG スクリーン座標変換 (region と mapDims に依存)
  const latLngToPixel = useMemo(() => {
    const { width, height } = mapDims;
    return (lat: number, lng: number) => ({
      x: ((lng - region.longitude) / region.longitudeDelta + 0.5) * width,
      y: (0.5 - (lat - region.latitude) / region.latitudeDelta) * height,
    });
  }, [region, mapDims]);

  // 霧エリアを evenodd で表現する SVG パス文字列 (外枠 + 探索済みヘックスを穴として追加)
  const fogSvgPath = useMemo(() => {
    if (!showsExplorationMap || mapDims.width === 0) return "";
    const { width, height } = mapDims;
    let d = `M 0 0 L ${width} 0 L ${width} ${height} L 0 ${height} Z `;
    for (const cell of grid) {
      const verts = hexVertices(cell.centerLat, cell.centerLng, cellSize);
      const px = verts.map((v) => latLngToPixel(v.latitude, v.longitude));
      d += `M ${px[0].x} ${px[0].y} `;
      for (let i = 1; i < px.length; i++) d += `L ${px[i].x} ${px[i].y} `;
      d += "Z ";
    }
    return d;
  }, [showsExplorationMap, mapDims, grid, cellSize, latLngToPixel]);

  // 霧エリア内にランダムに雲を配置 (スクリーン座標)
  const cloudSvgPositions = useMemo(() => {
    if (!showsExplorationMap || mapDims.width === 0) return [];
    const COUNT = 20;
    const seed =
      (Math.round(region.latitude * 50) * 1000000 + Math.round(region.longitude * 50)) >>> 0;
    const rng = seededRng(seed);
    const positions: { id: string; x: number; y: number; w: number }[] = [];
    let attempts = 0;
    while (positions.length < COUNT && attempts < COUNT * 30) {
      attempts++;
      const lat = region.latitude + (rng() - 0.5) * region.latitudeDelta * 1.8;
      const lng = region.longitude + (rng() - 0.5) * region.longitudeDelta * 1.8;
      if (!exploredKeys.has(latLngToHexKey(lat, lng, cellSize))) {
        const w = 50 + rng() * 60;
        const { x, y } = latLngToPixel(lat, lng);
        positions.push({ id: `cloud_${seed}_${attempts}`, x, y, w });
      }
    }
    return positions;
  }, [showsExplorationMap, mapDims, region, exploredKeys, cellSize, latLngToPixel]);

  const mapStyle = isDark ? darkMapStyle : lightMapStyle;

  return (
    <View
      style={{ flex: 1 }}
      onLayout={(e) =>
        setMapDims({
          width: e.nativeEvent.layout.width,
          height: e.nativeEvent.layout.height,
        })
      }
    >
      {initialRegion && (
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          provider={PROVIDER_GOOGLE}
          onRegionChangeComplete={handleRegionChange}
          initialRegion={initialRegion}
          customMapStyle={mapStyle}
        >
          {userCoords && (
            <Marker coordinate={userCoords} anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
              <PinIcon size={40} color={colorTokens.accent} />
            </Marker>
          )}
          {fogOverlay && (
            <Polygon
              coordinates={fogOverlay.outer}
              holes={fogOverlay.holes}
              fillColor={colors.fogFill}
              strokeWidth={0}
              strokeColor="transparent"
            />
          )}
          {mapOptions.showHexGrid &&
            showsGradientGrid &&
            visibleGrid.map((cell) => (
              <HexPolygon
                key={cell.key}
                centerLat={cell.centerLat}
                centerLng={cell.centerLng}
                cellSize={cellSize}
                weight={cell.weight}
                strokeColor={colors.hexStroke}
              />
            ))}
          {boundaryEdges.map((edge) => (
            <Polyline
              key={edge.key}
              coordinates={edge.coords}
              strokeColor={colorTokens.primary}
              strokeWidth={2}
            />
          ))}
          {routeResults && routeResults[selectedRouteIdx] && (
            <Polyline
              key={`route-${selectedRouteIdx}`}
              coordinates={routeResults[selectedRouteIdx].points.map((p) => ({
                latitude: p.lat,
                longitude: p.lng,
              }))}
              strokeColor={colorTokens.accent}
              strokeWidth={5}
              lineCap="round"
              lineJoin="round"
              tappable={false}
            />
          )}
        </MapView>
      )}

      {/* 霧エリア内だけに雲を描画する SVG オーバーレイ */}
      {showsExplorationMap && fogSvgPath !== "" && (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <Svg width={mapDims.width} height={mapDims.height}>
            <Defs>
              <ClipPath id="fogClip">
                <Path d={fogSvgPath} fillRule="evenodd" />
              </ClipPath>
            </Defs>
            <G clipPath="url(#fogClip)">
              {cloudSvgPositions.map((cloud) => {
                const scale = cloud.w / KUMO_W;
                const tx = cloud.x - cloud.w / 2;
                const ty = cloud.y - (KUMO_H * scale) / 2;
                return (
                  <G key={cloud.id} transform={`translate(${tx}, ${ty}) scale(${scale})`}>
                    <Path d={KUMO_PATH} fill="#DED7FF" fillOpacity={0.9} fillRule="evenodd" />
                  </G>
                );
              })}
            </G>
          </Svg>
        </View>
      )}

      {!fullscreen && <PlayerHUD onRoutePress={() => setRouteSearchVisible(true)} />}

      {routeSearchVisible && (
        <View
          style={[styles.routeSearchPanel, { paddingTop: insets.top + 10 }]}
          pointerEvents="box-none"
        >
          <View style={styles.routeSearchCard}>
            <View style={styles.routeSearchHeader}>
              <View style={styles.routeTitleRow}>
                <View style={styles.routeTitleIcon}>
                  <RouteIcon size={22} color={colorTokens.primaryForeground} />
                </View>
                <Text style={styles.routeSearchTitle}>ルート検索</Text>
              </View>
              <TouchableOpacity
                style={styles.routeCloseButton}
                onPress={() => setRouteSearchVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="ルート検索を閉じる"
              >
                <Text style={styles.routeCloseText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.routeInputGroup, { zIndex: 2 }]}>
              <Text style={styles.routeInputLabel}>出発地</Text>
              <PlaceInput
                value={routeOrigin}
                onChange={setRouteOrigin}
                placeholder="現在地"
                prefixOptions={
                  userCoords
                    ? [{ label: "現在地", location: { lat: userCoords.latitude, lng: userCoords.longitude } }]
                    : []
                }
              />
            </View>

            <View style={[styles.routeInputGroup, { zIndex: 1 }]}>
              <Text style={styles.routeInputLabel}>目的地</Text>
              <PlaceInput
                value={routeDestination}
                onChange={setRouteDestination}
                placeholder="目的地を入力"
              />
            </View>

            <View style={styles.routeModeRow}>
              {[
                ["quiet", "静音優先"],
                ["balanced", "バランス"],
                ["fast", "最短"],
              ].map(([value, label]) => {
                const selected = routeMode === value;
                return (
                  <Pressable
                    key={value}
                    style={[styles.routeModeButton, selected && styles.routeModeButtonSelected]}
                    onPress={() => setRouteMode(value as "quiet" | "balanced" | "fast")}
                    accessibilityRole="button"
                  >
                    <Text
                      style={[
                        styles.routeModeText,
                        selected && styles.routeModeTextSelected,
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {routeError && <Text style={styles.routeError}>{routeError}</Text>}

            <TouchableOpacity
              style={styles.routeSearchButton}
              activeOpacity={0.85}
              accessibilityRole="button"
              onPress={handleRouteSearch}
              disabled={routeLoading}
            >
              {routeLoading ? (
                <ActivityIndicator size="small" color={colorTokens.background} />
              ) : (
                <Text style={styles.routeSearchButtonText}>ルート検索</Text>
              )}
            </TouchableOpacity>

            {routeResults && (
              <View style={styles.routeResultsContainer}>
                {routeResults.map((route, idx) => (
                  <TouchableOpacity
                    key={route.rank}
                    style={[
                      styles.routeResultItem,
                      idx === selectedRouteIdx && styles.routeResultItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedRouteIdx(idx);
                      if (route.points.length) fitToRoute(route.points);
                      setRouteSearchVisible(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.routeResultHeader}>
                      <Text style={styles.routeResultLabel}>{route.label}</Text>
                      <Text style={styles.routeResultScore}>静音 {route.quiet_score}</Text>
                    </View>
                    <Text style={styles.routeResultMeta}>
                      {Math.round(route.distance_m / 10) / 100} km ·{" "}
                      {Math.round(route.duration_sec / 60)} 分 · {route.avg_db} dB
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      )}

      <View
        style={[styles.mapTopRow, { paddingTop: fullscreen ? insets.top : 10 }]}
        pointerEvents="box-none"
      >
        {!fullscreen && routeResults && routeResults[selectedRouteIdx] && (
          <TouchableOpacity
            style={styles.routeActiveBar}
            onPress={() => {
              setRouteResults(null);
              setSelectedRouteIdx(0);
            }}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="ルートを解除"
          >
            <Text style={styles.routeActiveBarText} numberOfLines={1}>
              {routeResults[selectedRouteIdx].label} ·{" "}
              {Math.round(routeResults[selectedRouteIdx].distance_m / 10) / 100} km ·{" "}
              {Math.round(routeResults[selectedRouteIdx].duration_sec / 60)} 分
            </Text>
            <Text style={styles.routeActiveBarClose}>×</Text>
          </TouchableOpacity>
        )}
        <View style={{ marginLeft: "auto" }}>
          <MapMenuPill
            isFullscreen={fullscreen}
            expanded={menuExpanded}
            onToggle={() => setMenuExpanded((v) => !v)}
            onFullscreen={() => {
              setFullscreen((v) => !v);
              setMenuExpanded(false);
            }}
            onCustomize={() => {
              setOptionsVisible(true);
              setMenuExpanded(false);
            }}
          />
        </View>
      </View>

      {!fullscreen && userCoords && (
        <TouchableOpacity
          style={styles.recenterButton}
          onPress={handleRecenter}
          activeOpacity={0.85}
          accessibilityRole="button"
        >
          <PinIcon size={36} color={colorTokens.secondary} />
        </TouchableOpacity>
      )}

      {!fullscreen && <FloatingButton onPress={() => setIsDark((v) => !v)} />}

      <MapOptionsDrawer
        visible={optionsVisible}
        options={mapOptions}
        onClose={() => setOptionsVisible(false)}
        onChange={handleOptionsChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  routeSearchPanel: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 1300,
  },
  routeSearchCard: {
    backgroundColor: colorTokens.hudPanel,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colorTokens.primaryForeground,
    padding: 14,
    gap: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 12,
  },
  routeSearchHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  routeTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 0,
  },
  routeTitleIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colorTokens.tertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  routeSearchTitle: {
    ...fontFamily.kiwiMaruMedium,
    color: colorTokens.hudText,
    fontSize: 20,
  },
  routeCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colorTokens.primaryForeground,
  },
  routeCloseText: {
    ...fontFamily.kiwiMaruMedium,
    color: colorTokens.background,
    fontSize: 22,
    lineHeight: 28,
  },
  routeInputGroup: {
    gap: 6,
  },
  routeInputLabel: {
    ...fontFamily.kiwiMaruMedium,
    color: colorTokens.hudText,
    fontSize: 13,
  },
  routeError: {
    ...fontFamily.kiwiMaruRegular,
    color: colorTokens.destructive,
    fontSize: 12,
  },
  routeActiveBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colorTokens.hudPanel,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colorTokens.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  routeActiveBarText: {
    ...fontFamily.kiwiMaruMedium,
    color: colorTokens.hudText,
    fontSize: 13,
    flex: 1,
  },
  routeActiveBarClose: {
    ...fontFamily.kiwiMaruMedium,
    color: colorTokens.accent,
    fontSize: 18,
    marginLeft: 12,
  },
  routeResultsContainer: {
    gap: 6,
  },
  routeResultItem: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colorTokens.blueToneDown,
    backgroundColor: colorTokens.darkBackground,
    padding: 10,
    gap: 4,
  },
  routeResultItemSelected: {
    borderColor: colorTokens.accent,
    backgroundColor: "rgba(240,55,157,0.08)",
  },
  routeResultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  routeResultLabel: {
    ...fontFamily.kiwiMaruMedium,
    color: colorTokens.hudText,
    fontSize: 13,
  },
  routeResultScore: {
    ...fontFamily.kiwiMaruMedium,
    color: colorTokens.hudProgressFill,
    fontSize: 13,
  },
  routeResultMeta: {
    ...fontFamily.kiwiMaruRegular,
    color: colorTokens.secondary,
    fontSize: 11,
  },
  routeModeRow: {
    flexDirection: "row",
    gap: 8,
  },
  routeModeButton: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colorTokens.primaryForeground,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colorTokens.darkBackground,
  },
  routeModeButtonSelected: {
    backgroundColor: colorTokens.tertiary,
  },
  routeModeText: {
    ...fontFamily.kiwiMaruMedium,
    color: colorTokens.tertiary,
    fontSize: 12,
  },
  routeModeTextSelected: {
    color: colorTokens.primaryForeground,
  },
  routeSearchButton: {
    height: 44,
    borderRadius: 8,
    backgroundColor: colorTokens.primaryForeground,
    alignItems: "center",
    justifyContent: "center",
  },
  routeSearchButtonText: {
    ...fontFamily.kiwiMaruMedium,
    color: colorTokens.background,
    fontSize: 15,
  },
  mapTopRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 20,
    gap: 8,
  },
  recenterButton: {
    position: "absolute",
    right: 20,
    bottom: 100,
    width: 64,
    height: 64,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colorTokens.tertiary,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 1000,
  },
});
