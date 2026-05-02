import { colors } from "@/constants/tokens";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Collection() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>図鑑</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgPage,
  },
  text: {
    color: colors.primary,
    fontSize: 24,
    letterSpacing: 2,
  },
});
