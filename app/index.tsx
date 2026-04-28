import React, { useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { Polygon, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { DUMMY_SOUND_DATA } from "./dummySoundData";

/** ダークマップ */
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#304a7d" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0e1626" }],
  },
  {
    featureType: "road",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative",
    elementType: "labels.text",
    stylers: [{ visibility: "off" }],
  },
];

/** zoomっぽい値を計算 */
const getZoomLevel = (region: Region) => {
  return Math.log2(360 / region.longitudeDelta);
};

/** zoomに応じてセルサイズ変更 */
const getCellSize = (zoom: number) => {
  const base = 0.0008;
  const scale = Math.pow(2, 14 - zoom);
  const size = base * scale;
  return Math.min(size, 0.02); // 上限
};

/** 色変換 */
const weightToColor = (w: number) => {
  if (w > 0.8) return "rgba(255,0,0,0.5)";
  if (w > 0.6) return "rgba(255,120,0,0.45)";
  if (w > 0.4) return "rgba(255,200,0,0.4)";
  if (w > 0.2) return "rgba(0,200,255,0.35)";
  return "rgba(0,100,255,0.3)";
};

/** グリッド生成 */
const buildGrid = (data: { latitude: number; longitude: number; weight: number }[], cellSize: number) => {
  const cells = new Map<string, { sum: number; count: number }>();

  for (const p of data) {
    const lat = Math.floor(p.latitude / cellSize) * cellSize;
    const lng = Math.floor(p.longitude / cellSize) * cellSize;
    const key = `${lat},${lng}`;

    const prev = cells.get(key) ?? { sum: 0, count: 0 };
    cells.set(key, {
      sum: prev.sum + p.weight,
      count: prev.count + 1,
    });
  }

  return Array.from(cells.entries()).map(([key, val]) => {
    const [lat, lng] = key.split(",").map(Number);
    return {
      lat,
      lng,
      weight: val.sum / val.count,
    };
  });
};

export default function App() {
  const [grid, setGrid] = useState(buildGrid(DUMMY_SOUND_DATA, 0.005));
  const [cellSize, setCellSize] = useState(0.005);

  const handleRegionChange = (region: Region) => {
    const zoom = getZoomLevel(region);
    const size = getCellSize(zoom);
    const newGrid = buildGrid(DUMMY_SOUND_DATA, size);
    setGrid(newGrid);
    setCellSize(size);
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
      {grid.map((cell, i) => (
        <Polygon
          key={i}
          coordinates={[
            { latitude: cell.lat, longitude: cell.lng },
            { latitude: cell.lat, longitude: cell.lng + cellSize },
            {
              latitude: cell.lat + cellSize,
              longitude: cell.lng + cellSize,
            },
            { latitude: cell.lat + cellSize, longitude: cell.lng },
          ]}
          fillColor={weightToColor(cell.weight)}
          strokeWidth={0.3}
          strokeColor="rgba(0,0,0,0.1)"
        />
      ))}
    </MapView>
  );
}
