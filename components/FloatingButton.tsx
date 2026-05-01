import React from "react";
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onPress?: (e: GestureResponderEvent) => void;
  label?: string;
  isDark?: boolean;
};

export default function FloatingButton({ onPress, label, isDark = true }: Props) {
  const icon = label ?? (isDark ? "☀️" : "🌙");

  return (
    <View pointerEvents="box-none" style={styles.container}>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={onPress}
        style={[styles.button, isDark ? styles.buttonDark : styles.buttonLight]}
        activeOpacity={0.85}
      >
        <Text style={styles.icon}>{icon}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    bottom: 40,
    zIndex: 1000,
  },
  button: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
  },
  buttonDark: {
    backgroundColor: "rgba(10, 12, 20, 0.82)",
    borderColor: "rgba(100, 200, 255, 0.2)",
  },
  buttonLight: {
    backgroundColor: "rgba(237, 232, 223, 0.92)",
    borderColor: "rgba(92, 74, 58, 0.25)",
  },
  icon: {
    fontSize: 22,
  },
});
