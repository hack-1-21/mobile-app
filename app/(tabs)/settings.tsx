import PlayerHUD from "@/components/PlayerHUD";
import { colors, radius, spacing } from "@/constants/tokens";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DEVICE_CONNECTED = false; // スマートウォッチ連携の状態（仮）

export default function Settings() {
  const { logout, isGuest } = useAuth();
  const [pairingModalVisible, setPairingModalVisible] = useState(false);
  const [pairingCode, setPairingCode] = useState("");

  function handlePairingSubmit() {
    // TODO: ペアリングコードを使った実際の連携処理
    setPairingModalVisible(false);
    setPairingCode("");
  }

  function handlePairingCancel() {
    setPairingModalVisible(false);
    setPairingCode("");
  }

  return (
    <SafeAreaView style={styles.container}>
      <PlayerHUD floating={false} />

      <Modal
        visible={pairingModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handlePairingCancel}
      >
        <Pressable style={styles.modalOverlay} onPress={handlePairingCancel}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Pressable style={styles.modalCard} onPress={() => {}}>
              <Text style={styles.modalTitle}>スマートウォッチを連携</Text>
              <Text style={styles.modalSubtitle}>
                デバイスに表示されているペアリングコードを入力してください
              </Text>
              <TextInput
                style={styles.pairingInput}
                value={pairingCode}
                onChangeText={setPairingCode}
                placeholder="例: AB12-CD34"
                placeholderTextColor={colors.muted}
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={9}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalCancelBtn} onPress={handlePairingCancel}>
                  <Text style={styles.modalCancelText}>キャンセル</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalSubmitBtn, !pairingCode && styles.modalSubmitBtnDisabled]}
                  onPress={handlePairingSubmit}
                  disabled={!pairingCode}
                >
                  <Text style={styles.modalSubmitText}>連携する</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

      <View style={styles.wrapper}>
        <Text style={styles.heading}>設定</Text>

        {!isGuest && (
          <View style={styles.deviceConnectContainer}>
            <Text style={styles.labelText}>スマートウォッチ連携</Text>
            {DEVICE_CONNECTED ? (
              <TouchableOpacity
                style={[styles.deviceConnectBtn, styles.disconnectedBtn]}
                onPress={() => alert("連携機能は開発中です")}
              >
                <Text style={styles.deviceDisconnectText}>連携解除</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.deviceConnectBtn, styles.connectedBtn]}
                onPress={() => setPairingModalVisible(true)}
              >
                <Text style={styles.deviceConnectText}>連携する</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <Pressable style={isGuest ? styles.loginBtn : styles.logoutBtn} onPress={logout}>
          {isGuest ? (
            <Text style={styles.loginText}>ログイン</Text>
          ) : (
            <Text style={styles.logoutText}>ログアウト</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPage,
  },
  wrapper: {
    paddingHorizontal: spacing.lg,
  },
  heading: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 2,
  },
  loginBtn: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primaryA50,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: spacing.md,
  },
  loginText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 15,
  },
  logoutBtn: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.4)",
    paddingVertical: 12,
    alignItems: "center",
    marginTop: spacing.md,
  },
  logoutText: {
    color: "#FF6B6B",
    fontWeight: "600",
    fontSize: 15,
  },
  labelText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: "600",
  },
  deviceConnectContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    justifyContent: "space-between",
    paddingVertical: spacing.md,
  },
  deviceConnectBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: radius.sm,
  },
  connectedBtn: {
    backgroundColor: colors.primary,
  },
  disconnectedBtn: {
    borderColor: colors.primaryA50,
    borderWidth: 1,
  },
  deviceConnectText: {
    color: colors.bgPage,
    fontSize: 14,
    fontWeight: "600",
  },
  deviceDisconnectText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.bgOverlay,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  modalCard: {
    width: "100%",
    backgroundColor: colors.bgPanel,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primaryA25,
    padding: spacing.lg,
    gap: spacing.md,
  },
  modalTitle: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: "700",
  },
  modalSubtitle: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
  },
  pairingInput: {
    backgroundColor: colors.primaryA08,
    borderWidth: 1,
    borderColor: colors.primaryA30,
    borderRadius: radius.sm,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    color: colors.textLight,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 4,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "flex-end",
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.primaryA25,
  },
  modalCancelText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  modalSubmitBtn: {
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
  },
  modalSubmitBtnDisabled: {
    backgroundColor: colors.primaryA30,
  },
  modalSubmitText: {
    color: colors.bgPage,
    fontSize: 14,
    fontWeight: "600",
  },
});
