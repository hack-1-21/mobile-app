import { apiFetch } from "@/constants/api";
import { SoundPoint } from "@/data/dummySoundData";
import { useCallback, useEffect, useRef, useState } from "react";
import { Region } from "react-native-maps";

const TILE_SIZE = 0.05;
const MAX_LONGITUDE_DELTA = 0.5;

function getVisibleTileKeys(region: Region): string[] {
  const swLat = region.latitude - region.latitudeDelta / 2;
  const neLat = region.latitude + region.latitudeDelta / 2;
  const swLng = region.longitude - region.longitudeDelta / 2;
  const neLng = region.longitude + region.longitudeDelta / 2;

  const keys: string[] = [];
  const minTileQ = Math.floor(swLat / TILE_SIZE);
  const maxTileQ = Math.floor(neLat / TILE_SIZE);
  const minTileR = Math.floor(swLng / TILE_SIZE);
  const maxTileR = Math.floor(neLng / TILE_SIZE);

  for (let q = minTileQ; q <= maxTileQ; q++) {
    for (let r = minTileR; r <= maxTileR; r++) {
      keys.push(`${q},${r}`);
    }
  }
  return keys;
}

function tileKeyToBBox(key: string): {
  neLat: number;
  neLng: number;
  swLat: number;
  swLng: number;
} {
  const [q, r] = key.split(",").map(Number);
  const round = (v: number) => Math.round(v * 10000) / 10000;
  return {
    swLat: round(q * TILE_SIZE),
    neLat: round((q + 1) * TILE_SIZE),
    swLng: round(r * TILE_SIZE),
    neLng: round((r + 1) * TILE_SIZE),
  };
}

export function useTiledSoundData(region: Region): SoundPoint[] {
  const fetchedTilesRef = useRef<Set<string>>(new Set());
  const soundMapRef = useRef<Map<number, SoundPoint>>(new Map());
  const [soundData, setSoundData] = useState<SoundPoint[]>([]);

  const fetchNewTiles = useCallback(async (currentRegion: Region) => {
    if (currentRegion.longitudeDelta > MAX_LONGITUDE_DELTA) return;

    const tileKeys = getVisibleTileKeys(currentRegion);
    const newKeys = tileKeys.filter((k) => !fetchedTilesRef.current.has(k));
    if (newKeys.length === 0) return;

    newKeys.forEach((k) => fetchedTilesRef.current.add(k));

    await Promise.all(
      newKeys.map(async (key) => {
        const bbox = tileKeyToBBox(key);
        const params = new URLSearchParams({
          ne_lat: String(bbox.neLat),
          ne_lng: String(bbox.neLng),
          sw_lat: String(bbox.swLat),
          sw_lng: String(bbox.swLng),
        });
        try {
          const points = await apiFetch<SoundPoint[]>(`/measurements/bbox?${params}`);
          points.forEach((p) => soundMapRef.current.set(p.id, p));
        } catch {
          fetchedTilesRef.current.delete(key);
        }
      }),
    );

    setSoundData(Array.from(soundMapRef.current.values()));
  }, []);

  useEffect(() => {
    fetchNewTiles(region);
  }, [region, fetchNewTiles]);

  return soundData;
}
