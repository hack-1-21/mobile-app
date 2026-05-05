import { colors } from "@/constants/tokens";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { KiwiMaru_400Regular, KiwiMaru_500Medium, useFonts } from "@expo-google-fonts/kiwi-maru";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

SplashScreen.preventAutoHideAsync();

function useAuthGuard() {
  const { token, isGuest, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const isAuthenticated = !!token || isGuest;
    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/welcome");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [token, isGuest, isLoading, segments, router]);
}

function RootNavigator() {
  const { isLoading } = useAuth();
  useAuthGuard();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    KiwiMaru_400Regular,
    KiwiMaru_500Medium,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.bgPage,
    alignItems: "center",
    justifyContent: "center",
  },
});
