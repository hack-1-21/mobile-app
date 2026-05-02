import { useMemo } from "react";

export type PlayerProfile = {
  nickname: string;
  level: number;
  xp: number;
  xpMax: number;
  points: number;
};

const DEFAULT_PLAYER_PROFILE: PlayerProfile = {
  nickname: "explorer",
  level: 7,
  xp: 340,
  xpMax: 500,
  points: 12480,
};

export function usePlayerProfile() {
  return useMemo(() => DEFAULT_PLAYER_PROFILE, []);
}
