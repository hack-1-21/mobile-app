import { colors, radius, spacing } from "@/constants/tokens";
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
        <Text style={styles.title}>SoundReal</Text>
        <Text style={styles.tagline}>街の音を、地図に刻む。</Text>
      </View>

      <View style={styles.actions}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={[styles.btn, styles.btnPrimary]}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.btnPrimaryText}>ログイン</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, styles.btnOutline]}
          onPress={() => router.push("/(auth)/register")}
        >
          <Text style={styles.btnOutlineText}>新規登録</Text>
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
            <ActivityIndicator color={colors.muted} size="small" />
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
    backgroundColor: colors.bgPage,
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
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 3,
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: 15,
    color: colors.textLightA45,
    letterSpacing: 1,
  },
  actions: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  error: {
    color: "#FF6B6B",
    fontSize: 13,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  btn: {
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnPrimary: {
    backgroundColor: colors.primary,
  },
  btnPrimaryText: {
    color: colors.bgPage,
    fontWeight: "700",
    fontSize: 16,
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: colors.primaryA30,
  },
  btnOutlineText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 16,
  },
  btnGhost: {
    paddingVertical: 12,
  },
  btnGhostText: {
    color: colors.muted,
    fontSize: 14,
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
    backgroundColor: colors.whiteA10,
  },
  dividerText: {
    color: colors.muted,
    fontSize: 12,
  },
});
