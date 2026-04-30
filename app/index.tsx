import React, { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { Polygon, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { darkMapStyle } from "../constants/mapStyle";
import { DUMMY_SOUND_DATA } from "../data/dummySoundData";
import { HexCell, buildHexGrid, hexVertices } from "../utils/hexGrid";
import { getCellSize, getZoomLevel, weightToColor } from "../utils/mapUtils";

const INITIAL_CELL_SIZE = 0.005;

export default function App() {
  const [{ grid, cellSize }, setHexState] = useState<{
    grid: HexCell[];
    cellSize: number;
  }>(() => ({
    grid: buildHexGrid(DUMMY_SOUND_DATA, INITIAL_CELL_SIZE),
    cellSize: INITIAL_CELL_SIZE,
  }));

  const currentSizeRef = useRef(INITIAL_CELL_SIZE);

  const handleRegionChange = (region: Region) => {
    const size = getCellSize(getZoomLevel(region));
    if (Math.abs(size - currentSizeRef.current) / currentSizeRef.current < 0.05) return;
    currentSizeRef.current = size;
    setHexState({ grid: buildHexGrid(DUMMY_SOUND_DATA, size), cellSize: size });
  };

  return (
    <MapView
      style={StyleSheet.absoluteFillObject}
      provider={PROVIDER_GOOGLE}
      customMapStyle={darkMapStyle}
      onRegionChangeComplete={handleRegionChange}
      initialRegion={{
        latitude: 35.6812,
        longitude: 139.7671,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {grid.map((cell) => (
        <Polygon
          key={cell.key}
          coordinates={hexVertices(cell.centerLat, cell.centerLng, cellSize)}
          fillColor={weightToColor(cell.weight)}
          strokeWidth={0.5}
          strokeColor="rgba(100,200,255,0.25)"
        />
      ))}
    </MapView>
  );
}
