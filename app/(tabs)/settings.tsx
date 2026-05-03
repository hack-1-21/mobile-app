import { colors, radius, spacing } from "@/constants/tokens";
import { useAuth } from "@/context/AuthContext";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Settings() {
  const insets = useSafeAreaInsets();
  const { logout, user, isGuest } = useAuth();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <Text style={styles.heading}>設定</Text>

      <View style={styles.userCard}>
        <Text style={styles.nickname}>{user?.nickname ?? "ゲスト"}</Text>
        <Text style={styles.userId}>{isGuest ? "ゲストユーザー" : `@${user?.user_id}`}</Text>
      </View>

      <Pressable style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>ログアウト</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPage,
    paddingHorizontal: spacing.lg,
  },
  heading: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: spacing.lg,
  },
  userCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primaryA15,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  nickname: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: "600",
  },
  userId: {
    color: colors.muted,
    fontSize: 13,
  },
  logoutBtn: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.4)",
    paddingVertical: 14,
    alignItems: "center",
  },
  logoutText: {
    color: "#FF6B6B",
    fontWeight: "600",
    fontSize: 15,
  },
});
