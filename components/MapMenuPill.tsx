import { colorTokens, colors, radius } from "@/constants/tokens";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity } from "react-native";
import { FullscreenIcon } from "./icons/FullscreenIcon";
import { MenuIcon } from "./icons/MenuIcon";
import { MinimizeIcon } from "./icons/MinimizeIcon";
import { WrenchIcon } from "./icons/WrenchIcon";

type Props = {
  expanded: boolean;
  isFullscreen: boolean;
  onToggle: () => void;
  onFullscreen: () => void;
  onCustomize: () => void;
};

const SECTION = 64;
const COLLAPSED_HEIGHT = SECTION;
const EXPANDED_HEIGHT = SECTION * 3;

export default function MapMenuPill({ expanded, isFullscreen, onToggle, onFullscreen, onCustomize }: Props) {
  const heightAnim = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;
  const itemOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(heightAnim, {
        toValue: expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
        useNativeDriver: false,
        bounciness: 4,
        speed: 18,
      }),
      Animated.timing(itemOpacity, {
        toValue: expanded ? 1 : 0,
        duration: expanded ? 220 : 100,
        useNativeDriver: false,
      }),
    ]).start();
  }, [expanded, heightAnim, itemOpacity]);

  return (
    <Animated.View style={[styles.pill, { height: heightAnim }]}>
      <TouchableOpacity style={styles.menuButton} onPress={onToggle} activeOpacity={0.7}>
        <MenuIcon size={30} color={colorTokens.secondary} />
      </TouchableOpacity>
      <Animated.View
        style={[styles.expandableArea, { opacity: itemOpacity }]}
        pointerEvents={expanded ? "auto" : "none"}
      >
        <TouchableOpacity style={[styles.section, styles.sectionButton]} onPress={onFullscreen} activeOpacity={0.7}>
          {isFullscreen ? <MinimizeIcon size={28} color={colorTokens.tertiary} /> : <FullscreenIcon size={28} color={colorTokens.tertiary} />}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.section, styles.sectionButton]} onPress={onCustomize} activeOpacity={0.7}>
          <WrenchIcon size={28} color={colorTokens.tertiary} />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    width: SECTION,
    backgroundColor: colorTokens.tertiary,
    borderRadius: SECTION / 2,
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  menuButton: {
    width: SECTION,
    height: SECTION,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    width: SECTION - 8,
    height: SECTION - 8,
    alignItems: "center",
    justifyContent: "center",
  },
  expandableArea: {
    gap: 4,
    paddingHorizontal: 4,
  },
  sectionButton: {
    backgroundColor: colorTokens.secondary,
    borderRadius: radius.full,
  },
});
