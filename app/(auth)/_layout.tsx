import { colors } from "@/constants/tokens";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bgPage },
      }}
    >
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen
        name="login"
        options={{
          headerShown: true,
          title: "",
          headerTransparent: true,
          headerTintColor: colors.primary,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: true,
          title: "",
          headerTransparent: true,
          headerTintColor: colors.primary,
        }}
      />
    </Stack>
  );
}
