import { StarIcon } from "@/components/icons/StarIcon";
import { StarLineIcon } from "@/components/icons/StarLineIcon";
import PlayerHUD from "@/components/PlayerHUD";
import { colorTokens, fontFamily, fontSize, radius } from "@/constants/tokens";
import { useAuth } from "@/context/AuthContext";
import { usePlayerProfile } from "@/hooks/usePlayerProfile";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

const POINTS_MAX = 1000;
const POINTS_OUTLINE_SIZE = 2;

const STAGE_2_POINTS = 400;
const STAGE_3_POINTS = 800;

const IMAGE_BASE_URL = "https://server-production-5adf.up.railway.app/images/gardens";

const GARDEN_IMAGE_PLACEHOLDER = {
  blurhash: "LGF5]+Yk^6#M@-5c,1J5@[or[Q6",
  width: 32,
  height: 32,
} as const;

export default function Hakoniwa() {
  const { user } = useAuth();
  const imageSource = `${IMAGE_BASE_URL}/${user?.user_id}/${user?.user_id}.png`;
  const { points } = usePlayerProfile();
  const pointsText = `${points.toLocaleString()}/${POINTS_MAX}`;
  const progress = points / POINTS_MAX;
  const stage = points < STAGE_2_POINTS ? 1 : points < STAGE_3_POINTS ? 2 : 3;
  return (
    <View style={styles.container}>
      <PlayerHUD />

      <View style={styles.imageContainer}>
        <View style={styles.titleContainer}>
          <View style={[styles.frameDecoration, styles.frameDecoration1]} />
          <View style={[styles.frameDecoration, styles.frameDecoration2]} />
          <View style={[styles.frameDecoration, styles.frameDecoration3]} />
          <View style={[styles.frameDecoration, styles.frameDecoration4]} />

          <View style={styles.starLinesContainer}>
            <StarLineIcon
              size={36}
              fillColor={stage >= 1 ? colorTokens.hudProgressFill : colorTokens.hakoniwaBorder}
              strokeColor={colorTokens.hakoniwaBorder}
            />
            <StarLineIcon
              size={36}
              fillColor={stage >= 2 ? colorTokens.hudProgressFill : colorTokens.mutedText}
              strokeColor={colorTokens.hakoniwaBorder}
            />
            <StarLineIcon
              size={36}
              fillColor={stage >= 3 ? colorTokens.hudProgressFill : colorTokens.mutedText}
              strokeColor={colorTokens.hakoniwaBorder}
            />
          </View>
        </View>
        <Image
          source={{ uri: imageSource }}
          style={styles.image}
          contentFit="cover"
          placeholder={GARDEN_IMAGE_PLACEHOLDER}
          placeholderContentFit="cover"
          transition={220}
          cachePolicy="none"
        />
        <View style={styles.pointsContainer}>
          <View style={styles.pointsRow}>
            <View style={styles.pointsBubble}>
              <StarIcon
                size={24}
                color={colorTokens.hudText}
                strokeColor={colorTokens.primaryForeground}
              />
            </View>
            <View style={styles.pointsOutlineBubble} />
            <View style={styles.pointsProgressShell}>
              <Text style={styles.pointsLabel}>探索pt</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.pointsProgressFill, { width: `${progress * 100}%` }]} />
              </View>
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
    flex: 1,
    backgroundColor: colorTokens.darkBackground,
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colorTokens.tertiary,
    borderRadius: radius.md,
    borderWidth: 5,
    borderColor: colorTokens.hakoniwaBorder,
    paddingHorizontal: 20,
    paddingVertical: 2,
    alignSelf: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    position: "relative",
    marginBottom: 10,
  },
  frameDecoration: {
    position: "absolute",
    width: 10,
    height: 10,
    backgroundColor: colorTokens.hakoniwaBorder,
    borderRadius: 50,
  },
  frameDecoration1: {
    top: -2,
    left: -2,
  },
  frameDecoration2: {
    top: -2,
    right: -2,
  },
  frameDecoration3: {
    bottom: -2,
    left: -2,
  },
  frameDecoration4: {
    bottom: -2,
    right: -2,
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 4,
    width: "100%",
  },
  image: {
    flex: 1,
    maxWidth: "100%",
    maxHeight: "100%",
    borderRadius: 30,
    borderWidth: 5,
    borderColor: colorTokens.hakoniwaBorder,
    aspectRatio: 1,
    height: "100%",
  },
  starLinesContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colorTokens.tertiary,
    borderRadius: 12,
  },
  pointsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  pointsRow: {
    alignSelf: "flex-start",
    paddingLeft: 16,
    paddingRight: 2,
    paddingVertical: 2,
    borderRadius: 50,
    backgroundColor: colorTokens.primaryForeground,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "100%",
    position: "relative",
  },
  pointsBubble: {
    position: "absolute",
    left: 0,
    width: 36,
    height: 36,
    borderRadius: 50,
    backgroundColor: colorTokens.tertiary,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  pointsOutlineBubble: {
    position: "absolute",
    left: -POINTS_OUTLINE_SIZE,
    width: 36 + POINTS_OUTLINE_SIZE * 2,
    height: 36 + POINTS_OUTLINE_SIZE * 2,
    borderRadius: 50,
    backgroundColor: colorTokens.primaryForeground,
    zIndex: 0,
  },
  pointsProgressShell: {
    flex: 1,
    borderRadius: 50,
    backgroundColor: colorTokens.tertiary,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingRight: 6,
    paddingLeft: 24,
    paddingVertical: 2,
  },
  progressTrack: {
    height: 8,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colorTokens.primaryForeground,
    backgroundColor: colorTokens.hudProgressTrack,
    overflow: "hidden",
    flex: 1,
  },
  pointsProgressFill: {
    height: "100%",
    backgroundColor: colorTokens.hudProgressFill,
  },
  pointsLabel: {
    ...fontFamily.kiwiMaruMedium,
    color: colorTokens.primaryForeground,
    fontSize: fontSize.medium,
  },
  pointsValue: {
    ...fontFamily.kiwiMaruMedium,
    color: colorTokens.primaryForeground,
    fontSize: fontSize.minimum,
  },
});
