import { SoundPoint } from "../data/dummySoundData";

export type HexCell = {
  key: string;
  centerLat: number;
  centerLng: number;
  weight: number;
};

const SQ3 = Math.sqrt(3);
// 東京付近(35°N)での経度補正: Mercator投影で1deg_lng ≈ cos(35°) * 1deg_lat
const LNG_SCALE = 1 / Math.cos((35.68 * Math.PI) / 180);

// 40dB(静寂) 〜 100dB(騒音) を 0〜1 に正規化
const dbToWeight = (db: number) => Math.min(Math.max((db - 40) / 60, 0), 1);

export const buildHexGrid = (data: SoundPoint[], hexSize: number): HexCell[] => {
  if (!isFinite(hexSize) || hexSize <= 0) {
    throw new Error(`Invalid hexSize: ${hexSize}`);
  }

  const cells = new Map<
    string,
    { sum: number; count: number; centerLat: number; centerLng: number }
  >();

  for (const p of data) {
    const lngNorm = p.longitude / LNG_SCALE;
    const r_frac = (2 * p.latitude) / (3 * hexSize);
    const q_frac = lngNorm / (SQ3 * hexSize) - r_frac / 2;
    const s_frac = -q_frac - r_frac;

    let q = Math.round(q_frac);
    let r = Math.round(r_frac);
    let s = Math.round(s_frac);
    const qd = Math.abs(q - q_frac);
    const rd = Math.abs(r - r_frac);
    const sd = Math.abs(s - s_frac);
    if (qd > rd && qd > sd) q = -r - s;
    else if (rd > sd) r = -q - s;

    const key = `${q},${r}`;
    const centerLat = hexSize * 1.5 * r;
    const centerLng = hexSize * SQ3 * LNG_SCALE * (q + r / 2);

    const prev = cells.get(key) ?? { sum: 0, count: 0, centerLat, centerLng };
    cells.set(key, {
      sum: prev.sum + dbToWeight(p.db),
      count: prev.count + 1,
      centerLat,
      centerLng,
    });
  }

  return Array.from(cells.entries()).map(([key, val]) => ({
    key,
    centerLat: val.centerLat,
    centerLng: val.centerLng,
    weight: val.sum / val.count,
  }));
};

export const hexVertices = (centerLat: number, centerLng: number, size: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i + Math.PI / 6;
    return {
      latitude: centerLat + size * Math.sin(angle),
      longitude: centerLng + size * LNG_SCALE * Math.cos(angle),
    };
  });
