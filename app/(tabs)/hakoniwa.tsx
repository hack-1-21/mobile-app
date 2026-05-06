import { StarIcon } from "@/components/icons/StarIcon";
import PlayerHUD from "@/components/PlayerHUD";
import { colorTokens, fontFamily, fontSize } from "@/constants/tokens";
import { useAuth } from "@/context/AuthContext";
import { usePlayerProfile } from "@/hooks/usePlayerProfile";
import { Image, StyleSheet, Text, View } from "react-native";

const POINTS_MAX = 100;
const POINTS_OUTLINE_SIZE = 2;

const IMAGE_BASE_URL = "https://server-production-5adf.up.railway.app/images/gardens";

export default function Hakoniwa() {
  const { user } = useAuth();
  const imageSource = `${IMAGE_BASE_URL}/${user?.user_id}/${user?.user_id}.png`;
  const { points } = usePlayerProfile();
  const pointsText = `${points.toLocaleString()}/${POINTS_MAX}`;
  const progress = points / POINTS_MAX;

  return (
    <View style={styles.container}>
      <PlayerHUD />

      <View style={styles.imageContainer}>
        <Image source={{ uri: imageSource }} style={styles.image} />
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
    resizeMode: "cover",
    maxWidth: "100%",
    maxHeight: "100%",
    borderRadius: 30,
    borderWidth: 5,
    borderColor: colorTokens.hakoniwaBorder,
    width: "100%",
    height: "100%",
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
