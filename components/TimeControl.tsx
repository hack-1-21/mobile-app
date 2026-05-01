import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  hour: number;
  onPrev: () => void;
  onNext: () => void;
};

export default function TimeControl({ hour, onPrev, onNext }: Props) {
  const label = `${String(hour).padStart(2, "0")}:00`;

  return (
    <View pointerEvents="box-none" style={styles.container}>
      <View style={styles.control}>
        <TouchableOpacity onPress={onPrev} style={styles.arrowButton} activeOpacity={0.7}>
          <Text style={styles.arrow}>{"‹"}</Text>
        </TouchableOpacity>
        <Text style={styles.time}>{label}</Text>
        <TouchableOpacity onPress={onNext} style={styles.arrowButton} activeOpacity={0.7}>
          <Text style={styles.arrow}>{"›"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  control: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 20, 40, 0.85)",
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "rgba(100,200,255,0.3)",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  arrowButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: {
    color: "rgba(100,200,255,0.9)",
    fontSize: 36,
    lineHeight: 40,
    fontWeight: "300",
  },
  time: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: 2,
    minWidth: 80,
    textAlign: "center",
  },
});
