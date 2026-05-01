import { Tabs } from "expo-router";
import { GameTabBar } from "@/components/GameTabBar";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <GameTabBar {...props} />} />
  );
}
