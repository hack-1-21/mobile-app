import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type MapOptions = {
  showHexGrid: boolean;
};

type Props = {
  visible: boolean;
  options: MapOptions;
  onClose: () => void;
  onChange: (next: Partial<MapOptions>) => void;
};

export default function MapOptionsDrawer({ visible, options, onClose, onChange }: Props) {
  const slideY = useRef(new Animated.Value(320)).current;

  useEffect(() => {
    Animated.spring(slideY, {
      toValue: visible ? 0 : 320,
      useNativeDriver: true,
      bounciness: 4,
      speed: 18,
    }).start();
  }, [visible, slideY]);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      {/* 背景タップで閉じる */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideY }] }]}>
        {/* ハンドル */}
        <View style={styles.handle} />

        <Text style={styles.title}>マップ設定</Text>

        <View style={styles.section}>
          <OptionRow
            label="ヘックスグリッド"
            description="音データのオーバーレイ表示"
            value={options.showHexGrid}
            onToggle={(v) => onChange({ showHexGrid: v })}
          />
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.8}>
          <Text style={styles.closeLabel}>閉じる</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

type OptionRowProps = {
  label: string;
  description: string;
  value: boolean;
  onToggle: (v: boolean) => void;
};

function OptionRow({ label, description, value, onToggle }: OptionRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowDesc}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "rgba(255,255,255,0.1)", true: "rgba(100,200,255,0.5)" }}
        thumbColor={value ? "#64C8FF" : "#888"}
        ios_backgroundColor="rgba(255,255,255,0.1)"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#0D1525",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: "rgba(100,200,255,0.15)",
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 18,
  },
  title: {
    color: "#E8F4FF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.4,
    marginBottom: 16,
  },
  section: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(100,200,255,0.1)",
    overflow: "hidden",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    color: "#E8F4FF",
    fontSize: 14,
    fontWeight: "600",
  },
  rowDesc: {
    color: "rgba(232,244,255,0.45)",
    fontSize: 11,
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(100,200,255,0.08)",
    marginHorizontal: 16,
  },
  closeButton: {
    backgroundColor: "rgba(100,200,255,0.12)",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(100,200,255,0.2)",
  },
  closeLabel: {
    color: "#64C8FF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
