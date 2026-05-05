import { OutlinedText } from "@/components/OutlinedText";
import { PencilIcon } from "@/components/icons/PencilIcon";
import { StarIcon } from "@/components/icons/StarIcon";
import { colorTokens, fontFamily, fontSize } from "@/constants/tokens";
import { usePlayerProfile } from "@/hooks/usePlayerProfile";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  floating?: boolean;
};

const POINTS_MAX = 100;

export default function PlayerHUD({ floating = true }: Props) {
  const { nickname, level, xp, xpMax, points } = usePlayerProfile();
  const progress = xpMax > 0 ? Math.min(xp / xpMax, 1) : 0;
  const levelText = String(level);
  const pointsText = `${points.toLocaleString()}/${POINTS_MAX}`;

  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="none" style={floating ? styles.container : styles.containerInline}>
      <View style={[styles.panel, { paddingTop: insets.top }]}>
        <View style={styles.inner}>
          <View style={styles.avatarRing}></View>

          <View style={styles.content}>
            <View style={styles.levelRow}>
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
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
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
    width: 80,
    height: 80,
    marginTop: 4,
    borderRadius: 55,
    borderWidth: 6,
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
    gap: 12,
  },
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  progressShell: {
    flex: 1,
    borderRadius: 50,
    backgroundColor: colorTokens.primaryForeground,
    justifyContent: "center",
  },
  progressTrack: {
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colorTokens.primaryForeground,
    backgroundColor: colorTokens.hudProgressTrack,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colorTokens.hudProgressFill,
  },
  levelBubble: {
    position: "absolute",
    right: 0,
    width: 52,
    height: 52,
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
    marginBottom: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
