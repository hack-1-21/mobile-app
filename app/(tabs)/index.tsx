import FloatingButton from "@/components/FloatingButton";
import MapOptionsDrawer, { MapOptions } from "@/components/MapOptionsDrawer";
import PlayerHUD from "@/components/PlayerHUD";
import { darkMapStyle, lightMapStyle } from "@/constants/mapStyle";
import { colors } from "@/constants/tokens";
import { useTiledSoundData } from "@/hooks/useTiledSoundData";
import * as Location from "expo-location";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Polygon, Polyline, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { ClipPath, Defs, G, Path, Svg } from "react-native-svg";
import { buildHexGrid, HexCell, hexVertices, latLngToHexKey } from "../../utils/hexGrid";
import { getCellSize, getZoomLevel, weightToColor } from "../../utils/mapUtils";

const INITIAL_REGION: Region = {
  latitude: 35.6812,
  longitude: 139.7671,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};
const INITIAL_CELL_SIZE = 0.005;

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

export default function App() {
  const [grid, setGrid] = useState<HexCell[]>([]);
  const [cellSize, setCellSize] = useState(INITIAL_CELL_SIZE);
  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const [mapDims, setMapDims] = useState({ width: 0, height: 0 });
  const soundData = useTiledSoundData(region);

  useEffect(() => {
    setGrid(buildHexGrid(soundData, cellSize));
  }, [soundData, cellSize]);

  const [optionsVisible, setOptionsVisible] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [mapOptions, setMapOptions] = useState<MapOptions>({
    showHexGrid: true,
  });

  const currentSizeRef = useRef(INITIAL_CELL_SIZE);
  const mapRef = useRef<MapView>(null);

  const handleMapReady = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;
    const loc = await Location.getCurrentPositionAsync({});
    mapRef.current?.animateToRegion(
      {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: INITIAL_REGION.latitudeDelta,
        longitudeDelta: INITIAL_REGION.longitudeDelta,
      },
      800,
    );
  };

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

  const exploredKeys = useMemo(() => new Set(grid.map((c) => c.key)), [grid]);

  // 大きな1枚の霧ポリゴンに探索済みセルを穴として切り抜く
  const fogOverlay = useMemo(() => {
    if (isDark) return null;
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
  }, [isDark, region, grid, cellSize]);

  // 霧と探索済みエリアの境界辺のみ Polyline で描画
  const boundaryEdges = useMemo(() => {
    if (isDark) return [];
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
  }, [isDark, grid, exploredKeys, cellSize]);

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
    if (isDark || mapDims.width === 0) return "";
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
  }, [isDark, mapDims, grid, cellSize, latLngToPixel]);

  // 霧エリア内にランダムに雲を配置 (スクリーン座標)
  const cloudSvgPositions = useMemo(() => {
    if (isDark || mapDims.width === 0) return [];
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
  }, [isDark, mapDims, region, exploredKeys, cellSize, latLngToPixel]);

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
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_GOOGLE}
        onRegionChangeComplete={handleRegionChange}
        onMapReady={handleMapReady}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        customMapStyle={mapStyle}
      >
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
          isDark &&
          grid.map((cell) => (
            <Polygon
              key={cell.key}
              coordinates={hexVertices(cell.centerLat, cell.centerLng, cellSize)}
              fillColor={weightToColor(cell.weight)}
              strokeWidth={0.5}
              strokeColor={colors.hexStroke}
            />
          ))}
        {boundaryEdges.map((edge) => (
          <Polyline
            key={edge.key}
            coordinates={edge.coords}
            strokeColor={colors.boundaryStroke}
            strokeWidth={2}
          />
        ))}
      </MapView>

      {/* 霧エリア内だけに雲を描画する SVG オーバーレイ */}
      {!isDark && fogSvgPath !== "" && (
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

      <PlayerHUD />

      {/* マップオプションボタン (右上) */}
      <TouchableOpacity
        style={styles.optionsButton}
        onPress={() => setOptionsVisible(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.optionsIcon}>⚙</Text>
      </TouchableOpacity>

      <FloatingButton isDark={isDark} onPress={() => setIsDark((v) => !v)} />

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
  optionsButton: {
    position: "absolute",
    top: 116,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.bgCard,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.primaryA15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 100,
  },
  optionsIcon: {
    fontSize: 18,
    color: colors.primary,
  },
});
