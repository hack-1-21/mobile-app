import FloatingButton from "@/components/FloatingButton";
import MapOptionsDrawer, { MapOptions } from "@/components/MapOptionsDrawer";
import PlayerHUD from "@/components/PlayerHUD";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Polygon, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { darkMapStyle, lightMapStyle } from "../../constants/mapStyle";
import { DUMMY_SOUND_DATA } from "../../data/dummySoundData";
import { buildHexGrid, HexCell, hexVertices } from "../../utils/hexGrid";
import { getCellSize, getZoomLevel, weightToColor } from "../../utils/mapUtils";

const INITIAL_CELL_SIZE = 0.005;

export default function App() {
  const [{ grid, cellSize }, setHexState] = useState<{
    grid: HexCell[];
    cellSize: number;
  }>(() => ({
    grid: buildHexGrid(DUMMY_SOUND_DATA, INITIAL_CELL_SIZE),
    cellSize: INITIAL_CELL_SIZE,
  }));

  const [optionsVisible, setOptionsVisible] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [mapOptions, setMapOptions] = useState<MapOptions>({
    showHexGrid: true,
  });

  const currentSizeRef = useRef(INITIAL_CELL_SIZE);

  const handleRegionChange = (region: Region) => {
    const size = getCellSize(getZoomLevel(region));
    if (Math.abs(size - currentSizeRef.current) / currentSizeRef.current < 0.05) return;
    currentSizeRef.current = size;
    setHexState({ grid: buildHexGrid(DUMMY_SOUND_DATA, size), cellSize: size });
  };

  const handleOptionsChange = (next: Partial<MapOptions>) => {
    setMapOptions((prev) => ({ ...prev, ...next }));
  };

  const mapStyle = isDark ? darkMapStyle : lightMapStyle;

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle as any}
        onRegionChangeComplete={handleRegionChange}
        initialRegion={{
          latitude: 35.6812,
          longitude: 139.7671,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {mapOptions.showHexGrid &&
          grid.map((cell) => (
            <Polygon
              key={cell.key}
              coordinates={hexVertices(cell.centerLat, cell.centerLng, cellSize)}
              fillColor={weightToColor(cell.weight)}
              strokeWidth={0.5}
              strokeColor="rgba(100,200,255,0.25)"
            />
          ))}
      </MapView>

      <PlayerHUD nickname="explorer" level={7} xp={340} xpMax={500} points={12480} />

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
    backgroundColor: "rgba(10, 12, 20, 0.78)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(100, 200, 255, 0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 100,
  },
  optionsIcon: {
    fontSize: 18,
    color: "#64C8FF",
  },
});
