import { useAuth } from "@/context/AuthContext";
import { useMemo } from "react";

export type PlayerProfile = {
  nickname: string;
  level: number;
  xp: number;
  xpMax: number;
  points: number;
};

const XP_PER_LEVEL = 500;

export function usePlayerProfile(): PlayerProfile {
  const { user } = useAuth();

  return useMemo(
    () => ({
      nickname: user?.nickname ?? "explorer",
      level: user?.level ?? 1,
      xp: user?.exp ?? 0,
      xpMax: XP_PER_LEVEL,
      points: user?.points ?? 0,
    }),
    [user],
  );
}
