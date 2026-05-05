import { colors, colorTokens, fontSize, shadowStyles } from "@/constants/tokens";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BookIcon } from "./icons/BookIcon";
import { PinIcon } from "./icons/PinIcon";
import { TreeIcon } from "./icons/TreeIcon";
import { WrenchIcon } from "./icons/WrenchIcon";

const TAB_LABELS: Record<string, string> = {
  index: "MAP",
  hakoniwa: "箱庭",
  collection: "図鑑",
  settings: "設定",
};

type TabItemProps = {
  label: string;
  tab: string;
  isActive: boolean;
  onPress: () => void;
};

function TabIcon({ type }: { type: string }) {
  const size = 48;
  const color = colorTokens.tertiary;

  switch (type) {
    case "index":
      return <PinIcon size={size} color={color} />;
    case "hakoniwa":
      return <TreeIcon size={size} color={color} />;
    case "collection":
      return <BookIcon size={size} color={color} />;
    case "settings":
      return <WrenchIcon size={size} color={color} />;
  }
}

function TabItem({ label, tab, isActive, onPress }: TabItemProps) {
  return (
    <Pressable onPress={onPress} style={styles.tabPressable}>
      <View style={styles.tabItem}>
        <View style={styles.tabIcon}>
          <TabIcon type={tab} />
        </View>
        <Text style={[styles.tabLabel, isActive ? styles.tabLabelActive : styles.tabLabelInactive]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

export function GameTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = TAB_LABELS[route.name] ?? options.title ?? route.name;
          const isActive = state.index === index;

          return (
            <TabItem
              key={route.key}
              label={label}
              tab={route.name}
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
    backgroundColor: colorTokens.primary,
    color: colorTokens.primaryForeground,
    borderTopWidth: 4,
    borderTopColor: colorTokens.secondary,
  },
  container: {
    flexDirection: "row",
    position: "relative",
    paddingTop: 8,
    paddingBottom: 4,
  },
  tabPressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    height: 72,
    aspectRatio: 1,
  },
  tabIcon: {
    ...shadowStyles.tabIcon,
  },
  glowBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primaryA07,
    borderRadius: 4,
  },
  tabLabel: {
    fontSize: fontSize.large,
    fontWeight: "500",
  },
  tabLabelActive: {
    color: colorTokens.tertiary,
  },
  tabLabelInactive: {
    color: colorTokens.tertiary,
  },
});
