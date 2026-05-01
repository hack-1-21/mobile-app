import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Sandbox() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>箱庭</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0a1428",
  },
  text: {
    color: "#64C8FF",
    fontSize: 24,
    letterSpacing: 2,
  },
});
