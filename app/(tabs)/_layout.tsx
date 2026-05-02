import { GameTabBar } from "@/components/GameTabBar";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <GameTabBar {...props} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="hakoniwa" />
      <Tabs.Screen name="collection" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
