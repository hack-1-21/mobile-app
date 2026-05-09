import PlayerHUD from "@/components/PlayerHUD";
import { ApiError, apiFetch } from "@/constants/api";
import { colors, colorTokens, fontFamily, fontSize, radius, spacing } from "@/constants/tokens";
import { useAuth } from "@/context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
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

/** 開発用: `true` にすると連携APIを叩かず、連携済みUIだけ確認できる（本番では常に無効）。 */
const PREVIEW_SMARTWATCH_LINKED_UI = __DEV__ && false;

const MOCK_LINKED_DEVICES_FOR_PREVIEW: LinkedDevice[] = [
  {
    device_id: "PREVIEW-WATCH-9F3A",
    linked_at: "2026-05-01T10:15:00.000Z",
    last_used_at: "2026-05-06T14:22:00.000Z",
  },
];

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
    if (PREVIEW_SMARTWATCH_LINKED_UI) {
      setDeviceError(null);
      setLinkedDevices(MOCK_LINKED_DEVICES_FOR_PREVIEW);
      return;
    }

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
    if ((!authHeaders && !PREVIEW_SMARTWATCH_LINKED_UI) || unlinkingDeviceId) return;

    setUnlinkingDeviceId(deviceId);
    try {
      if (PREVIEW_SMARTWATCH_LINKED_UI) {
        setLinkedDevices((devices) => devices.filter((device) => device.device_id !== deviceId));
        return;
      }

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
                placeholderTextColor={colorTokens.mutedText}
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
                    <ActivityIndicator color={colorTokens.tertiary} />
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

        {(!isGuest || PREVIEW_SMARTWATCH_LINKED_UI) && (
          <View style={styles.deviceSection}>
            <View style={styles.deviceConnectContainer}>
              <Text style={styles.labelText}>スマートウォッチ連携</Text>
              <TouchableOpacity
                onPress={() => setPairingModalVisible(true)}
              >
                <LinearGradient
                  colors={[colorTokens.primaryForeground, colorTokens.secondary]}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.deviceConnectBtn}
                >
                  <Text style={styles.deviceConnectText}>連携する</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {isLoadingDevices ? (
              <View style={styles.deviceStateRow}>
                <ActivityIndicator color={colorTokens.secondary} />
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
                        <ActivityIndicator color={colorTokens.secondary} />
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
    ...fontFamily.kiwiMaruMedium,
    fontSize: 30,
    textAlign: "center",
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
    ...fontFamily.kiwiMaruRegular,
    fontSize: fontSize.large,
  },
  logoutBtn: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colorTokens.destructiveForeground,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: spacing.md,
  },
  logoutText: {
    color: colorTokens.destructive,
    ...fontFamily.kiwiMaruRegular,
    fontSize: fontSize.medium,
  },
  labelText: {
    color: colorTokens.tertiary,
    ...fontFamily.kiwiMaruMedium,
    fontSize: fontSize.large,
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
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
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
    fontSize: fontSize.large,
    ...fontFamily.kiwiMaruMedium,
  },
  deviceDisconnectText: {
    color: colorTokens.tertiary,
    fontSize: fontSize.medium,
    ...fontFamily.kiwiMaruRegular,
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
    fontSize: fontSize.medium,
    ...fontFamily.kiwiMaruRegular,
  },
  deviceErrorText: {
    flex: 1,
    color: colorTokens.destructive,
    fontSize: fontSize.medium,
    ...fontFamily.kiwiMaruRegular,
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
    fontSize: fontSize.medium,
    ...fontFamily.kiwiMaruMedium,
  },
  emptyDeviceText: {
    color: colorTokens.mutedText,
    fontSize: fontSize.medium,
    ...fontFamily.kiwiMaruRegular,
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
    fontSize: fontSize.medium,
    ...fontFamily.kiwiMaruMedium,
  },
  deviceMetaText: {
    color: colorTokens.mutedText,
    fontSize: fontSize.minimum,
    ...fontFamily.kiwiMaruRegular,
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
    fontSize: fontSize.large,
    ...fontFamily.kiwiMaruMedium,
  },
  modalSubtitle: {
    color: colorTokens.mutedText,
    fontSize: fontSize.medium,
    ...fontFamily.kiwiMaruRegular,
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
    fontSize: fontSize.medium,
    ...fontFamily.kiwiMaruMedium,
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
    fontSize: fontSize.medium,
    ...fontFamily.kiwiMaruMedium,
  },
});
