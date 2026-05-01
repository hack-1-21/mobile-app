import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  nickname: string;
  level: number;
  xp: number;
  xpMax: number;
  points: number;
};

export default function PlayerHUD({ nickname, level, xp, xpMax, points }: Props) {
  const progress = Math.min(xp / xpMax, 1);

  return (
    <View pointerEvents="none" style={styles.container}>
      <View style={styles.card}>
        {/* アイコン */}
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>🎧</Text>
        </View>

        {/* 名前 + レベルバー */}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.nickname} numberOfLines={1}>
              {nickname}
            </Text>
            <Text style={styles.levelBadge}>Lv.{level}</Text>
          </View>
          <View style={styles.xpBarTrack}>
            <View style={[styles.xpBarFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        {/* 区切り */}
        <View style={styles.divider} />

        {/* 探索ポイント */}
        <View style={styles.pointsBlock}>
          <Text style={styles.pointsValue}>{points.toLocaleString()}</Text>
          <Text style={styles.pointsLabel}>PT</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 56,
    left: 16,
    right: 16,
    zIndex: 100,
    alignItems: "flex-start",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 12, 20, 0.78)",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 10,
    // backdrop blur is not available in RN — use semi-transparent bg instead
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(100, 200, 255, 0.15)",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(100, 200, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: {
    fontSize: 18,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  nickname: {
    color: "#E8F4FF",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
    flexShrink: 1,
  },
  levelBadge: {
    color: "#64C8FF",
    fontSize: 11,
    fontWeight: "700",
    backgroundColor: "rgba(100, 200, 255, 0.15)",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 5,
  },
  xpBarTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  xpBarFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: "#64C8FF",
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(100, 200, 255, 0.2)",
  },
  pointsBlock: {
    alignItems: "center",
    minWidth: 44,
  },
  pointsValue: {
    color: "#FFD060",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  pointsLabel: {
    color: "rgba(255,208,96,0.6)",
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 1,
    marginTop: 1,
  },
});
