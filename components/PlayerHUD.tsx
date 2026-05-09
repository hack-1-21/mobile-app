import { OutlinedText } from "@/components/OutlinedText";
import { PencilIcon } from "@/components/icons/PencilIcon";
import { StarIcon } from "@/components/icons/StarIcon";
import { colorTokens, fontFamily, fontSize } from "@/constants/tokens";
import { usePlayerProfile } from "@/hooks/usePlayerProfile";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const POINTS_MAX = 1000;
const LEVEL_OUTLINE_SIZE = 4;

export default function PlayerHUD() {
  const { nickname, level, xp, xpMax, points } = usePlayerProfile();
  const progress = xpMax > 0 ? Math.min(xp / xpMax, 1) : 0;
  const levelText = String(level);
  const pointsText = `${points.toLocaleString()}/${POINTS_MAX}`;

  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="none" style={styles.containerInline}>
      <View style={[styles.panel, { paddingTop: insets.top }]}>
        <View style={styles.inner}>
          <View style={styles.avatarRing}>
            <Image
              source={{
                uri: `https://api.dicebear.com/9.x/thumbs/png?seed=${nickname.toLowerCase().replace(/ /g, "")}`,
              }}
              style={styles.avatar}
            />
          </View>

          <View style={styles.content}>
            <View style={styles.levelRow}>
              <View style={styles.levelOutlineProgress} />
              <View style={styles.levelOutlineBubble} />
              <View style={styles.progressShell}>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                </View>
              </View>
              <View style={styles.levelBubble}>
                <View style={styles.levelContent}>
                  <Text style={styles.levelPrefix}>LV</Text>
                  <OutlinedText text={levelText} />
                </View>
              </View>
            </View>

            <View style={styles.nameRow}>
              <Text style={styles.nickname} numberOfLines={1} adjustsFontSizeToFit>
                {nickname}
              </Text>
              <PencilIcon size={20} color={colorTokens.hudText} />
            </View>

            <View style={styles.pointsPill}>
              <View style={styles.starBadge}>
                <StarIcon
                  size={18}
                  color={colorTokens.hudText}
                  strokeColor={colorTokens.primaryForeground}
                />
              </View>
              <Text style={styles.pointsLabel}>探索pt</Text>
              <Text style={styles.pointsValue}>{pointsText}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerInline: {
    paddingTop: 0,
  },
  panel: {
    paddingHorizontal: 20,
    paddingBottom: 18,
    backgroundColor: colorTokens.hudPanel,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  avatarRing: {
    marginTop: 4,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: colorTokens.hudStroke,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatar: {
    width: 80,
    height: 80,
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: 0,
  },
  levelRow: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    marginTop: 20,
    shadowColor: colorTokens.blueShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  levelOutlineProgress: {
    position: "absolute",
    left: -LEVEL_OUTLINE_SIZE,
    right: 22,
    height: 30,
    borderRadius: 50,
    backgroundColor: colorTokens.primaryForeground,
  },
  levelOutlineBubble: {
    position: "absolute",
    right: -LEVEL_OUTLINE_SIZE,
    width: 42 + LEVEL_OUTLINE_SIZE * 2,
    height: 42 + LEVEL_OUTLINE_SIZE * 2,
    borderRadius: 50,
    backgroundColor: colorTokens.primaryForeground,
  },
  progressShell: {
    flex: 1,
    borderRadius: 50,
    backgroundColor: colorTokens.tertiary,
    justifyContent: "center",
    padding: 6,
  },
  progressTrack: {
    height: 8,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colorTokens.primaryForeground,
    backgroundColor: colorTokens.hudProgressTrack,
    overflow: "hidden",
    marginRight: 40,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colorTokens.hudProgressFill,
  },
  levelBubble: {
    position: "absolute",
    right: 0,
    width: 42,
    height: 42,
    borderRadius: 50,
    backgroundColor: colorTokens.tertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  levelContent: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  levelPrefix: {
    ...fontFamily.kiwiMaruMedium,
    color: colorTokens.primaryForeground,
    fontSize: 8,
    marginBottom: 7,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  nickname: {
    ...fontFamily.kiwiMaruRegular,
    flexShrink: 1,
    color: colorTokens.hudText,
    fontSize: fontSize.maximum,
  },
  pointsPill: {
    alignSelf: "flex-start",
    paddingLeft: 32,
    paddingRight: 16,
    paddingVertical: 4,
    borderRadius: 50,
    backgroundColor: colorTokens.tertiary,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  starBadge: {
    position: "absolute",
    left: 0,
    width: 30,
    height: 30,
    borderRadius: 27,
    backgroundColor: colorTokens.tertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  pointsLabel: {
    ...fontFamily.kiwiMaruMedium,
    color: colorTokens.primaryForeground,
    fontSize: fontSize.minimum,
  },
  pointsValue: {
    ...fontFamily.kiwiMaruMedium,
    color: colorTokens.primaryForeground,
    fontSize: fontSize.minimum,
  },
});
