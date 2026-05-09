import { apiFetch } from "@/constants/api";

export type PlacePrediction = {
  placeId: string;
  description: string;
};

export async function fetchPlacePredictions(input: string): Promise<PlacePrediction[]> {
  if (input.trim().length < 2) return [];
  try {
    const data = await apiFetch<{ predictions: { place_id: string; description: string }[] }>(
      `/places/autocomplete?input=${encodeURIComponent(input)}`,
    );
    return data.predictions.map((p) => ({ placeId: p.place_id, description: p.description }));
  } catch {
    return [];
  }
}

export async function fetchPlaceLocation(
  placeId: string,
): Promise<{ lat: number; lng: number } | null> {
  try {
    return await apiFetch<{ lat: number; lng: number }>(
      `/places/details?place_id=${encodeURIComponent(placeId)}`,
    );
  } catch {
    return null;
  }
}
