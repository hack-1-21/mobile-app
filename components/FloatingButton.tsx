import { colors, colorTokens } from "@/constants/tokens";
import React from "react";
import { GestureResponderEvent, StyleSheet, TouchableOpacity, View } from "react-native";
import { RefreshIcon } from "./icons/RefreshIcon";

type Props = {
  onPress?: (e: GestureResponderEvent) => void;
};

export default function FloatingButton({ onPress }: Props) {
  return (
    <View pointerEvents="box-none" style={styles.container}>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={onPress}
        style={[styles.button]}
        activeOpacity={0.85}
      >
        <RefreshIcon size={40} color={colorTokens.tertiary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    bottom: 24,
    zIndex: 1000,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    backgroundColor: colorTokens.primaryForeground,
  },
});
