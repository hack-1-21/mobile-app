import { colors, radius } from "@/constants/tokens";
import { usePlayerProfile } from "@/hooks/usePlayerProfile";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  floating?: boolean;
};

export default function PlayerHUD({ floating = true }: Props) {
  const { nickname, level, xp, xpMax, points } = usePlayerProfile();
  const progress = Math.min(xp / xpMax, 1);

  return (
    <View pointerEvents="none" style={floating ? styles.container : styles.containerInline}>
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
  containerInline: {
    alignItems: "stretch",
    padding: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.primaryA15,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryA12,
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
    color: colors.textLight,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
    flexShrink: 1,
  },
  levelBadge: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "700",
    backgroundColor: colors.primaryA15,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: radius.xs,
  },
  xpBarTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.whiteA10,
    overflow: "hidden",
  },
  xpBarFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: colors.primaryA20,
  },
  pointsBlock: {
    alignItems: "center",
    minWidth: 44,
  },
  pointsValue: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  pointsLabel: {
    color: colors.goldA60,
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 1,
    marginTop: 1,
  },
});
