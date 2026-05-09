import { Region } from "react-native-maps";

export const getZoomLevel = (region: Region) => {
  if (region.longitudeDelta <= 0) {
    throw new Error("longitudeDelta must be positive");
  }
  return Math.log2(360 / region.longitudeDelta);
};

export const getCellSize = (zoom: number) => {
  const size = 0.0006 * Math.pow(2, 14 - zoom);
  return Math.min(size, 0.006);
};

export const weightToColor = (w: number) => {
  if (w > 0.8) return "rgba(255,0,0,0.5)";
  if (w > 0.6) return "rgba(255,120,0,0.45)";
  if (w > 0.4) return "rgba(255,200,0,0.4)";
  if (w > 0.2) return "rgba(0,200,255,0.35)";
  return "rgba(0,100,255,0.3)";
};

// ライトモード（羊皮紙マップ）向け：彩度・不透明度を上げてくっきり見せる
export const weightToColorLight = (w: number) => {
  if (w > 0.8) return "rgba(190,45,45,0.88)";
  if (w > 0.6) return "rgba(210,100,35,0.82)";
  if (w > 0.4) return "rgba(205,165,35,0.78)";
  if (w > 0.2) return "rgba(65,145,190,0.75)";
  return "rgba(75,155,95,0.72)";
};
