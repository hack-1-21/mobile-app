import { colorTokens } from "@/constants/tokens";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colorTokens.darkBackground },
      }}
    >
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen
        name="login"
        options={{
          headerShown: true,
          title: "",
          headerTransparent: true,
          headerTintColor: colorTokens.primaryForeground,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: true,
          title: "",
          headerTransparent: true,
          headerTintColor: colorTokens.primaryForeground,
        }}
      />
    </Stack>
  );
}
