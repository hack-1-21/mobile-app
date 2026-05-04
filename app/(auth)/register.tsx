import { ApiError } from "@/constants/api";
import { colors, radius, spacing } from "@/constants/tokens";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
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

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email.trim() || !nickname.trim() || !password) {
      setError("すべての項目を入力してください");
      return;
    }
    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register(email.trim(), nickname.trim(), password);
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
          <Text style={styles.label}>メールアドレス</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="example@mail.com"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
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
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••（６文字以上）"
              placeholderTextColor={colors.muted}
              secureTextEntry={!showPassword}
            />
            <Pressable
              style={styles.passwordToggle}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={colors.textLightA45}
              />
            </Pressable>
          </View>

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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.primaryA15,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    color: colors.textLight,
    fontSize: 15,
  },
  passwordToggle: {
    padding: spacing.sm,
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
