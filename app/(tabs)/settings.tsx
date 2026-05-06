import PlayerHUD from "@/components/PlayerHUD";
import { ApiError, apiFetch } from "@/constants/api";
import { colors, colorTokens, radius, spacing } from "@/constants/tokens";
import { useAuth } from "@/context/AuthContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type LinkedDevice = {
  device_id: string;
  linked_at: string;
  last_used_at: string | null;
};

type DeviceStatusResponse = {
  status: "linked" | "unlinked";
};

function formatDeviceDate(value: string | null): string {
  if (!value) return "未使用";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "不明";

  return date.toLocaleString("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Settings() {
  const { logout, isGuest, token } = useAuth();
  const [pairingModalVisible, setPairingModalVisible] = useState(false);
  const [pairingCode, setPairingCode] = useState("");
  const [linkedDevices, setLinkedDevices] = useState<LinkedDevice[]>([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  const [isSubmittingPairing, setIsSubmittingPairing] = useState(false);
  const [unlinkingDeviceId, setUnlinkingDeviceId] = useState<string | null>(null);
  const [deviceError, setDeviceError] = useState<string | null>(null);

  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : undefined),
    [token],
  );

  const fetchLinkedDevices = useCallback(async () => {
    if (isGuest || !authHeaders) {
      setLinkedDevices([]);
      setDeviceError(null);
      return;
    }

    setIsLoadingDevices(true);
    setDeviceError(null);
    try {
      const devices = await apiFetch<LinkedDevice[]>("/device/links", {
        headers: authHeaders,
      });
      setLinkedDevices(devices);
    } catch (error) {
      const message = error instanceof Error ? error.message : "時計の取得に失敗しました";
      setDeviceError(message);
    } finally {
      setIsLoadingDevices(false);
    }
  }, [authHeaders, isGuest]);

  useEffect(() => {
    void fetchLinkedDevices();
  }, [fetchLinkedDevices]);

  const normalizedPairingCode = pairingCode.trim().toUpperCase();

  async function handlePairingSubmit() {
    if (!authHeaders || !normalizedPairingCode || isSubmittingPairing) return;

    setIsSubmittingPairing(true);
    try {
      await apiFetch<DeviceStatusResponse>("/device/complete-link", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ code: normalizedPairingCode }),
      });
      setPairingModalVisible(false);
      setPairingCode("");
      await fetchLinkedDevices();
      Alert.alert("連携しました", "スマートウォッチをこのアカウントに紐づけました。");
    } catch (error) {
      const message =
        error instanceof ApiError || error instanceof Error ? error.message : "連携に失敗しました";
      Alert.alert("連携できませんでした", message);
    } finally {
      setIsSubmittingPairing(false);
    }
  }

  function handlePairingCancel() {
    if (isSubmittingPairing) return;
    setPairingModalVisible(false);
    setPairingCode("");
  }

  function confirmUnlink(deviceId: string) {
    Alert.alert("連携を解除しますか？", "解除後、この時計のデバイストークンは無効になります。", [
      { text: "キャンセル", style: "cancel" },
      {
        text: "解除",
        style: "destructive",
        onPress: () => {
          void handleUnlinkDevice(deviceId);
        },
      },
    ]);
  }

  async function handleUnlinkDevice(deviceId: string) {
    if (!authHeaders || unlinkingDeviceId) return;

    setUnlinkingDeviceId(deviceId);
    try {
      await apiFetch<DeviceStatusResponse>(`/device/links/${encodeURIComponent(deviceId)}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      setLinkedDevices((devices) => devices.filter((device) => device.device_id !== deviceId));
    } catch (error) {
      const message =
        error instanceof ApiError || error instanceof Error
          ? error.message
          : "連携解除に失敗しました";
      Alert.alert("解除できませんでした", message);
    } finally {
      setUnlinkingDeviceId(null);
    }
  }

  return (
    <View style={styles.container}>
      <PlayerHUD />

      <Modal
        visible={pairingModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handlePairingCancel}
      >
        <Pressable style={styles.modalOverlay} onPress={handlePairingCancel}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Pressable style={styles.modalCard} onPress={() => { }}>
              <Text style={styles.modalTitle}>スマートウォッチを連携</Text>
              <Text style={styles.modalSubtitle}>
                デバイスに表示されているペアリングコードを入力してください
              </Text>
              <TextInput
                style={styles.pairingInput}
                value={pairingCode}
                onChangeText={(value) => setPairingCode(value.toUpperCase())}
                placeholder="例: NFHH-9927"
                placeholderTextColor={colors.muted}
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={9}
                editable={!isSubmittingPairing}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={handlePairingCancel}
                  disabled={isSubmittingPairing}
                >
                  <Text style={styles.modalCancelText}>キャンセル</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalSubmitBtn,
                    (!normalizedPairingCode || isSubmittingPairing) &&
                    styles.modalSubmitBtnDisabled,
                  ]}
                  onPress={handlePairingSubmit}
                  disabled={!normalizedPairingCode || isSubmittingPairing}
                >
                  {isSubmittingPairing ? (
                    <ActivityIndicator color={colors.bgPage} />
                  ) : (
                    <Text style={styles.modalSubmitText}>連携する</Text>
                  )}
                </TouchableOpacity>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

      <ScrollView contentContainerStyle={styles.wrapper}>
        <Text style={styles.heading}>設定</Text>

        {!isGuest && (
          <View style={styles.deviceSection}>
            <View style={styles.deviceConnectContainer}>
              <Text style={styles.labelText}>スマートウォッチ連携</Text>
              <TouchableOpacity
                style={[styles.deviceConnectBtn, styles.connectedBtn]}
                onPress={() => setPairingModalVisible(true)}
              >
                <Text style={styles.deviceConnectText}>連携する</Text>
              </TouchableOpacity>
            </View>

            {isLoadingDevices ? (
              <View style={styles.deviceStateRow}>
                <ActivityIndicator color={colors.primary} />
                <Text style={styles.deviceStateText}>連携中の時計を取得しています</Text>
              </View>
            ) : deviceError ? (
              <View style={styles.deviceStateRow}>
                <Text style={styles.deviceErrorText}>{deviceError}</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={fetchLinkedDevices}>
                  <Text style={styles.retryText}>再読み込み</Text>
                </TouchableOpacity>
              </View>
            ) : linkedDevices.length === 0 ? (
              <Text style={styles.emptyDeviceText}>連携中の時計はありません。</Text>
            ) : (
              <View style={styles.deviceList}>
                {linkedDevices.map((device) => (
                  <View key={device.device_id} style={styles.deviceItem}>
                    <View style={styles.deviceInfo}>
                      <Text style={styles.deviceIdText} numberOfLines={1}>
                        {device.device_id}
                      </Text>
                      <Text style={styles.deviceMetaText}>
                        連携: {formatDeviceDate(device.linked_at)}
                      </Text>
                      <Text style={styles.deviceMetaText}>
                        最終使用: {formatDeviceDate(device.last_used_at)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.deviceConnectBtn,
                        styles.disconnectedBtn,
                        unlinkingDeviceId === device.device_id && styles.deviceConnectBtnDisabled,
                      ]}
                      onPress={() => confirmUnlink(device.device_id)}
                      disabled={unlinkingDeviceId !== null}
                    >
                      {unlinkingDeviceId === device.device_id ? (
                        <ActivityIndicator color={colors.primary} />
                      ) : (
                        <Text style={styles.deviceDisconnectText}>解除</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorTokens.darkBackground,
  },
  wrapper: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  heading: {
    color: colorTokens.tertiary,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 2,
  },
  loginBtn: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colorTokens.primaryForeground,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: spacing.md,
  },
  loginText: {
    color: colorTokens.tertiary,
    fontWeight: "600",
    fontSize: 15,
  },
  logoutBtn: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colorTokens.destructive,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: spacing.md,
  },
  logoutText: {
    color: colorTokens.destructive,
    fontWeight: "600",
    fontSize: 15,
  },
  labelText: {
    color: colorTokens.tertiary,
    fontSize: 16,
    fontWeight: "600",
  },
  deviceSection: {
    gap: spacing.sm,
    paddingVertical: spacing.md,
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
  deviceConnectBtnDisabled: {
    opacity: 0.55,
  },
  connectedBtn: {
    backgroundColor: colorTokens.primaryForeground,
  },
  disconnectedBtn: {
    borderColor: colorTokens.mutedText,
    borderWidth: 1,
  },
  deviceConnectText: {
    color: colorTokens.background,
    fontSize: 14,
    fontWeight: "600",
  },
  deviceDisconnectText: {
    color: colorTokens.tertiary,
    fontSize: 14,
    fontWeight: "600",
  },
  deviceStateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colorTokens.tertiary,
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  deviceStateText: {
    color: colorTokens.mutedText,
    fontSize: 13,
  },
  deviceErrorText: {
    flex: 1,
    color: colorTokens.destructive,
    fontSize: 13,
  },
  retryBtn: {
    borderWidth: 1,
    borderColor: colors.primaryA30,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  retryText: {
    color: colorTokens.primaryForeground,
    fontSize: 13,
    fontWeight: "600",
  },
  emptyDeviceText: {
    color: colorTokens.mutedText,
    fontSize: 13,
    paddingVertical: spacing.sm,
  },
  deviceList: {
    gap: spacing.sm,
  },
  deviceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colorTokens.primary,
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  deviceInfo: {
    flex: 1,
    gap: 4,
  },
  deviceIdText: {
    color: colorTokens.tertiary,
    fontSize: 13,
    fontWeight: "700",
  },
  deviceMetaText: {
    color: colorTokens.mutedText,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colorTokens.overlayBackground,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  modalCard: {
    width: "100%",
    backgroundColor: colorTokens.darkBackground,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colorTokens.primaryForeground,
    padding: spacing.lg,
    gap: spacing.md,
  },
  modalTitle: {
    color: colorTokens.tertiary,
    fontSize: 18,
    fontWeight: "700",
  },
  modalSubtitle: {
    color: colorTokens.mutedText,
    fontSize: 13,
    lineHeight: 20,
  },
  pairingInput: {
    backgroundColor: colorTokens.darkBackground,
    borderWidth: 1,
    borderColor: colorTokens.primaryForeground,
    borderRadius: radius.sm,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    color: colorTokens.tertiary,
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
    borderColor: colorTokens.mutedText,
  },
  modalCancelText: {
    color: colorTokens.mutedText,
    fontSize: 14,
    fontWeight: "600",
  },
  modalSubmitBtn: {
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colorTokens.primaryForeground,
  },
  modalSubmitBtnDisabled: {
    backgroundColor: colorTokens.primaryForeground,
    opacity: 0.5,
  },
  modalSubmitText: {
    color: colorTokens.background,
    fontSize: 14,
    fontWeight: "600",
  },
});
