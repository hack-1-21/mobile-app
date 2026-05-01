import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_LABELS: Record<string, string> = {
  index: "MAP",
  sandbox: "箱庭",
  collection: "図鑑",
  settings: "設定",
};

type TabItemProps = {
  label: string;
  isActive: boolean;
  onPress: () => void;
};

function TabItem({ label, isActive, onPress }: TabItemProps) {
  return (
    <Pressable onPress={onPress} style={styles.tabPressable}>
      <View style={styles.tabItem}>
        <Text style={[styles.tabLabel, isActive ? styles.tabLabelActive : styles.tabLabelInactive]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

export function GameTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const tabWidth = 100 / state.routes.length;

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      <View style={styles.scanLine} />

      <View style={styles.container}>
        {/* アクティブインジケーター */}
        <View
          style={[styles.indicator, { width: `${tabWidth}%`, left: `${tabWidth * state.index}%` }]}
        />

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = TAB_LABELS[route.name] ?? options.title ?? route.name;
          const isActive = state.index === index;

          return (
            <TabItem
              key={route.key}
              label={label}
              isActive={isActive}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isActive && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "rgba(6, 14, 32, 0.97)",
    borderTopWidth: 0,
  },
  scanLine: {
    height: 1,
    backgroundColor: "rgba(100,200,255,0.18)",
  },
  container: {
    flexDirection: "row",
    height: 56,
    position: "relative",
  },
  indicator: {
    position: "absolute",
    top: 0,
    height: 2,
    backgroundColor: "#64C8FF",
    shadowColor: "#64C8FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 4,
  },
  tabPressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    position: "relative",
  },
  glowBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(100,200,255,0.07)",
    borderRadius: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  tabLabelActive: {
    color: "#64C8FF",
  },
  tabLabelInactive: {
    color: "rgba(100,200,255,0.35)",
  },
});
