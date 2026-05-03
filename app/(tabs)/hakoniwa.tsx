import PlayerHUD from "@/components/PlayerHUD";
import { colors, radius } from "@/constants/tokens";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Hakoniwa() {
  return (
    <SafeAreaView style={styles.container}>
      <PlayerHUD floating={false} />

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {/* <Image
          source={require("/Users/harunaishii/workspace/hack-1-2026/sound-collect/assets/hakoniwa/image.png")}
          style={styles.image}
        /> */}
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
  }
});
