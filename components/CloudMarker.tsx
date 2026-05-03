import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";

// kumo.svg の viewBox は 216x97 (アスペクト比 ≈ 2.23:1)
const ASPECT = 97 / 216;

export default function CloudMarker({ size = 72 }: { size?: number }) {
  return (
    <View pointerEvents="none">
      <Image
        source={require("../assets/kumo.svg")}
        style={{ width: size, height: Math.round(size * ASPECT) }}
        contentFit="contain"
      />
    </View>
  );
}
