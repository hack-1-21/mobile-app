import { ApiError } from "@/constants/api";
import { colors, radius, spacing } from "@/constants/tokens";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { register } = useAuth();

  const [userId, setUserId] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!userId.trim() || !nickname.trim() || !password) {
      setError("すべての項目を入力してください");
      return;
    }
    if (password !== passwordConfirm) {
      setError("パスワードが一致しません");
      return;
    }
    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register(userId.trim(), nickname.trim(), password);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "登録に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + spacing.lg,
            paddingBottom: insets.bottom + spacing.lg,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>新規登録</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.form}>
          <Text style={styles.label}>ユーザーID</Text>
          <TextInput
            style={styles.input}
            value={userId}
            onChangeText={setUserId}
            placeholder="user_id"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>ニックネーム</Text>
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="表示名"
            placeholderTextColor={colors.muted}
            autoCorrect={false}
          />

          <Text style={styles.label}>パスワード</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••（6文字以上）"
            placeholderTextColor={colors.muted}
            secureTextEntry
          />

          <Text style={styles.label}>パスワード（確認）</Text>
          <TextInput
            style={styles.input}
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            placeholder="••••••••"
            placeholderTextColor={colors.muted}
            secureTextEntry
          />

          <Pressable
            style={[styles.btn, styles.btnPrimary]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.bgPage} />
            ) : (
              <Text style={styles.btnPrimaryText}>登録する</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.link}>ログインはこちら</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgPage,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.textLight,
    textAlign: "center",
    marginBottom: spacing.lg * 2,
  },
  error: {
    color: "#FF6B6B",
    fontSize: 13,
    textAlign: "center",
    marginBottom: spacing.md,
    backgroundColor: "rgba(255,107,107,0.1)",
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  form: {
    gap: spacing.sm,
  },
  label: {
    fontSize: 12,
    color: colors.textLightA45,
    marginBottom: 2,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.primaryA15,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    color: colors.textLight,
    fontSize: 15,
  },
  btn: {
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
  },
  btnPrimaryText: {
    color: colors.bgPage,
    fontWeight: "700",
    fontSize: 15,
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: colors.primaryA30,
  },
  btnOutlineText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 15,
  },
  footer: {
    marginTop: spacing.lg * 1.5,
    alignItems: "center",
  },
  link: {
    color: colors.primary,
    fontSize: 14,
  },
});
