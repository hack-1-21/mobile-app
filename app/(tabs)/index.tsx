import FloatingButton from "@/components/FloatingButton";
import MapOptionsDrawer, { MapOptions } from "@/components/MapOptionsDrawer";
import PlayerHUD from "@/components/PlayerHUD";
import { darkMapStyle, lightMapStyle } from "@/constants/mapStyle";
import { colors } from "@/constants/tokens";
import * as Location from "expo-location";
import React, { useMemo, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Polygon, Polyline, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { DUMMY_SOUND_DATA } from "../../data/dummySoundData";
import { buildHexGrid, HexCell, hexVertices } from "../../utils/hexGrid";
import { getCellSize, getZoomLevel, weightToColor } from "../../utils/mapUtils";

const INITIAL_REGION: Region = {
  latitude: 35.6812,
  longitude: 139.7671,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};
const INITIAL_CELL_SIZE = 0.005;

// 辺インデックス → 隣接セルの (dq, dr) オフセット（pointy-top 六角形）
const EDGE_NEIGHBORS: [number, number][] = [
  [0, 1], // 辺0 (NE)
  [-1, 1], // 辺1 (NW)
  [-1, 0], // 辺2 (W)
  [0, -1], // 辺3 (SW)
  [1, -1], // 辺4 (SE)
  [1, 0], // 辺5 (E)
];

export default function App() {
  const [{ grid, cellSize }, setHexState] = useState<{
    grid: HexCell[];
    cellSize: number;
  }>(() => ({
    grid: buildHexGrid(DUMMY_SOUND_DATA, INITIAL_CELL_SIZE),
    cellSize: INITIAL_CELL_SIZE,
  }));

  const [region, setRegion] = useState<Region>(INITIAL_REGION);
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
    setHexState({ grid: buildHexGrid(DUMMY_SOUND_DATA, size), cellSize: size });
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

  const mapStyle = isDark ? darkMapStyle: lightMapStyle;

  return (
    <View style={{ flex: 1 }}>
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
