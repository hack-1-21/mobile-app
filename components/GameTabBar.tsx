import { colorTokens, fontSize, shadowStyles } from "@/constants/tokens";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
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

function TabIcon({ type, isActive }: { type: string; isActive: boolean }) {
  const size = 44;
  const color = isActive ? colorTokens.secondary : colorTokens.tertiary;

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

const SEPARATOR_WIDTH = 1;
const SEPARATOR_HEIGHT = 56;

function TabSeparator({ gradientId }: { gradientId: string }) {
  return (
    <View style={styles.separatorWrap} pointerEvents="none">
      <Svg width={SEPARATOR_WIDTH} height={SEPARATOR_HEIGHT}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={colorTokens.secondary} stopOpacity={1} />
            <Stop offset="50%" stopColor={colorTokens.tertiary} stopOpacity={1} />
            <Stop offset="100%" stopColor={colorTokens.secondary} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Rect
          x={0}
          y={0}
          width={SEPARATOR_WIDTH}
          height={SEPARATOR_HEIGHT}
          rx={1}
          fill={`url(#${gradientId})`}
        />
      </Svg>
    </View>
  );
}

function TabItem({ label, tab, isActive, onPress }: TabItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tabPressable, isActive ? styles.tabItemActive : null]}
    >
      <View style={styles.tabItem}>
        <View style={[styles.tabIcon, isActive ? styles.tabIconActive : null]}>
          <TabIcon type={tab} isActive={isActive} />
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
          const showSeparatorAfter = index < state.routes.length - 1;

          return (
            <React.Fragment key={route.key}>
              <View style={styles.tabSlot}>
                <TabItem
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
              </View>
              {showSeparatorAfter ? <TabSeparator gradientId={`game-tab-sep-${index}`} /> : null}
            </React.Fragment>
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
    borderTopColor: colorTokens.primaryForeground,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    paddingTop: 6,
    paddingBottom: 4,
  },
  tabSlot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  separatorWrap: {
    height: 72,
    justifyContent: "center",
    alignItems: "center",
  },
  tabPressable: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    height: 72,
    aspectRatio: 1,
    paddingVertical: 4,
  },
  tabItemActive: {
    backgroundColor: colorTokens.tertiary,
    borderColor: colorTokens.secondary,
    borderWidth: 3,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  tabIcon: {
    ...shadowStyles.tabIcon,
  },
  tabIconActive: {
    ...shadowStyles.tabIconActive,
  },
  tabLabel: {
    fontSize: fontSize.large,
    fontWeight: "500",
    fontFamily: Platform.select({
      android: "KiwiMaru_400Regular",
      ios: "KiwiMaru-Regular",
    }),
  },
  tabLabelActive: {
    color: colorTokens.secondary,
  },
  tabLabelInactive: {
    color: colorTokens.tertiary,
  },
});
