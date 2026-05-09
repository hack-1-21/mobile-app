import { colors, colorTokens, radius } from "@/constants/tokens";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HourRangeSlider from "./HourRangeSlider";

export type MapOptions = {
  showHexGrid: boolean;
  timeRange: [number, number];
};

const formatHour = (h: number) => `${String(h).padStart(2, "0")}:00`;

type Props = {
  visible: boolean;
  options: MapOptions;
  onClose: () => void;
  onChange: (next: Partial<MapOptions>) => void;
};

export default function MapOptionsDrawer({ visible, options, onClose, onChange }: Props) {
  const slideY = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    Animated.spring(slideY, {
      toValue: visible ? 0 : 600,
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

        <View style={styles.timeSection}>
          <View style={styles.timeHeader}>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>時間帯</Text>
              <Text style={styles.rowDesc}>選択した時間に記録された音のみ表示</Text>
            </View>
            <Text style={styles.timeValue}>
              {formatHour(options.timeRange[0])} – {formatHour(options.timeRange[1])}
            </Text>
          </View>
          <HourRangeSlider value={options.timeRange} onChange={(v) => onChange({ timeRange: v })} />
          <View style={styles.timeAxis}>
            <Text style={styles.axisLabel}>0</Text>
            <Text style={styles.axisLabel}>6</Text>
            <Text style={styles.axisLabel}>12</Text>
            <Text style={styles.axisLabel}>18</Text>
            <Text style={styles.axisLabel}>24</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.8}>
          <Text style={styles.closeLabel}>閉じる</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colorTokens.overlayBackground,
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colorTokens.darkBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    paddingHorizontal: 20,
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
    color: colorTokens.tertiary,
    fontSize: 14,
    fontWeight: "600",
  },
  rowDesc: {
    color: colorTokens.mutedText,
    fontSize: 11,
  },
  separator: {
    height: 1,
    backgroundColor: colorTokens.blueToneDown,
    marginHorizontal: 16,
  },
  timeSection: {
    backgroundColor: colorTokens.darkBackground,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colorTokens.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 24,
    gap: 14,
  },
  timeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeValue: {
    color: colorTokens.secondary,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.4,
    fontVariant: ["tabular-nums"],
  },
  timeAxis: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  axisLabel: {
    color: colorTokens.tertiary,
    fontSize: 10,
    fontVariant: ["tabular-nums"],
  },
  closeButton: {
    backgroundColor: colorTokens.blueToneDown,
    borderRadius: radius.md,
    paddingVertical: 13,
    alignItems: "center",
  },
  closeLabel: {
    color: colorTokens.tertiary,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
