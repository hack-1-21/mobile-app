import { colors, radius } from "@/constants/tokens";
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
        trackColor={{ false: colors.whiteA10, true: colors.primaryA50 }}
        thumbColor={value ? colors.primary : colors.muted}
        ios_backgroundColor={colors.whiteA10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bgOverlay,
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.bgPanel,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: colors.primaryA15,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.whiteA20,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 18,
  },
  title: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.4,
    marginBottom: 16,
  },
  section: {
    backgroundColor: colors.whiteA04,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primaryA10,
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
    color: colors.textLight,
    fontSize: 14,
    fontWeight: "600",
  },
  rowDesc: {
    color: colors.textLightA45,
    fontSize: 11,
  },
  separator: {
    height: 1,
    backgroundColor: colors.primaryA08,
    marginHorizontal: 16,
  },
  closeButton: {
    backgroundColor: colors.primaryA12,
    borderRadius: radius.md,
    paddingVertical: 13,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primaryA20,
  },
  closeLabel: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
