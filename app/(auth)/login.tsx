import { ApiError } from "@/constants/api";
import { colorTokens, fontFamily, fontSize, radius, spacing } from "@/constants/tokens";
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

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("メールアドレスとパスワードを入力してください");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "ログインに失敗しました");
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
        <Text style={styles.title}>ログイン</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.form}>
          <Text style={styles.label}>メールアドレス</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="example@mail.com"
            placeholderTextColor={colorTokens.mutedText}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
          />

          <Text style={styles.label}>パスワード（６文字以上）</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={colorTokens.mutedText}
              secureTextEntry={!showPassword}
            />
            <Pressable style={styles.passwordToggle} onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={colorTokens.mutedText}
              />
            </Pressable>
          </View>

          <Pressable
            style={[styles.btn, styles.btnPrimary]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colorTokens.background} />
            ) : (
              <Text style={styles.btnPrimaryText}>ログイン</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Pressable onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.link}>アカウントを作成する</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colorTokens.darkBackground,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
  },
  title: {
    fontSize: fontSize.maximum,
    ...fontFamily.kiwiMaruMedium,
    color: colorTokens.tertiary,
    textAlign: "center",
    marginBottom: spacing.lg * 2,
  },
  error: {
    color: colorTokens.destructive,
    fontSize: fontSize.medium,
    ...fontFamily.kiwiMaruRegular,
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
    color: colorTokens.mutedText,
    marginBottom: 2,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colorTokens.darkBackground,
    borderWidth: 1,
    borderColor: colorTokens.primaryForeground,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    color: colorTokens.tertiary,
    fontSize: fontSize.medium,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colorTokens.darkBackground,
    borderWidth: 1,
    borderColor: colorTokens.primaryForeground,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    color: colorTokens.tertiary,
    fontSize: fontSize.medium,
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
    backgroundColor: colorTokens.primaryForeground,
  },
  btnPrimaryText: {
    color: colorTokens.background,
    ...fontFamily.kiwiMaruMedium,
    fontSize: fontSize.medium,
  },
  footer: {
    marginTop: spacing.lg * 1.5,
    alignItems: "center",
  },
  link: {
    color: colorTokens.tertiary,
    ...fontFamily.kiwiMaruMedium,
    fontSize: fontSize.medium,
  },
});
