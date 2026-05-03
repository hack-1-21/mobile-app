import PlayerHUD from "@/components/PlayerHUD";
import { colors, radius } from "@/constants/tokens";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Hakoniwa() {
  const imageSource = require("@/assets/hakoniwa/image.png");
  return (
    <SafeAreaView style={styles.container}>
      <PlayerHUD floating={false} />

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image source={imageSource} style={styles.image} />
        <TouchableOpacity onPress={() => {}} style={styles.button}>
          <Text>箱庭図鑑</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPage,
  },
  image: {
    flex: 1,
    resizeMode: "contain",
    maxWidth: "100%",
    maxHeight: "100%",
  },
  button: {
    marginTop: 20,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
});
