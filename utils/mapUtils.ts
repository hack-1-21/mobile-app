import { Region } from "react-native-maps";

export const getZoomLevel = (region: Region) =>
  Math.log2(360 / region.longitudeDelta);

export const getCellSize = (zoom: number) => {
  const size = 0.0008 * Math.pow(2, 14 - zoom);
  return Math.min(size, 0.008);
};

export const weightToColor = (w: number) => {
  if (w > 0.8) return "rgba(255,0,0,0.5)";
  if (w > 0.6) return "rgba(255,120,0,0.45)";
  if (w > 0.4) return "rgba(255,200,0,0.4)";
  if (w > 0.2) return "rgba(0,200,255,0.35)";
  return "rgba(0,100,255,0.3)";
};
