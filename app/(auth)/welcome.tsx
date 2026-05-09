import { colorTokens, fontFamily, fontSize, radius, spacing } from "@/constants/tokens";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { loginAsGuest } = useAuth();
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGuest = async () => {
    setError("");
    setGuestLoading(true);
    try {
      await loginAsGuest();
    } catch {
      setError("ゲストログインに失敗しました");
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top + spacing.lg * 2, paddingBottom: insets.bottom + spacing.lg },
      ]}
    >
      <View style={styles.hero}>
        <Text style={styles.tagline}>あなたの冒険が、誰かの道しるべに。</Text>
        <Text style={styles.title}>SoundReal</Text>
      </View>

      <View style={styles.actions}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable
          style={[styles.btn, styles.btnPrimary]}
          onPress={() => router.push("/(auth)/register")}
        >
          <Text style={styles.btnPrimaryText}>新規登録</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, styles.btnOutline]}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.btnOutlineText}>ログイン</Text>
        </Pressable>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>または</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable
          style={[styles.btn, styles.btnGhost]}
          onPress={handleGuest}
          disabled={guestLoading}
        >
          {guestLoading ? (
            <ActivityIndicator color={colorTokens.mutedText} size="small" />
          ) : (
            <Text style={styles.btnGhostText}>ゲストとして続ける</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colorTokens.darkBackground,
    paddingHorizontal: spacing.lg,
    justifyContent: "space-between",
  },
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 42,
    color: colorTokens.tertiary,
    letterSpacing: 3,
    marginBottom: spacing.sm,
    ...fontFamily.kiwiMaruMedium,
  },
  tagline: {
    fontSize: fontSize.large,
    color: colorTokens.mutedText,
    ...fontFamily.kiwiMaruRegular,
    letterSpacing: 1,
  },
  actions: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  error: {
    color: colorTokens.destructive,
    fontSize: fontSize.medium,
    ...fontFamily.kiwiMaruRegular,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  btn: {
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnPrimary: {
    backgroundColor: colorTokens.primaryForeground,
  },
  btnPrimaryText: {
    color: colorTokens.background,
    ...fontFamily.kiwiMaruMedium,
    fontSize: fontSize.large,
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: colorTokens.primaryForeground,
  },
  btnOutlineText: {
    color: colorTokens.tertiary,
    ...fontFamily.kiwiMaruMedium,
    fontSize: fontSize.large,
  },
  btnGhost: {
    paddingVertical: spacing.sm,
  },
  btnGhostText: {
    color: colorTokens.mutedText,
    fontSize: fontSize.medium,
    ...fontFamily.kiwiMaruRegular,
    textAlign: "center",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.xs,
    gap: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colorTokens.mutedText,
  },
  dividerText: {
    color: colorTokens.mutedText,
    fontSize: fontSize.minimum,
    ...fontFamily.kiwiMaruRegular,
  },
});
