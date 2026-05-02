import { colors } from "@/constants/tokens";
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
    backgroundColor: colors.bgTimeControl,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: colors.primaryA30,
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
    color: colors.primaryA90,
    fontSize: 36,
    lineHeight: 40,
    fontWeight: "300",
  },
  time: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: 2,
    minWidth: 80,
    textAlign: "center",
  },
});
