import PlayerHUD from "@/components/PlayerHUD";
import { colorTokens, fontFamily, fontSize, spacing } from "@/constants/tokens";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Collection() {
  return (
    <View style={styles.container}>
      <PlayerHUD />
      <View style={styles.content}>
        <Text style={styles.text}>図鑑</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorTokens.darkBackground,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  text: {
    color: colorTokens.tertiary,
    fontSize: fontSize.maximum,
    ...fontFamily.kiwiMaruMedium,
  },
});
