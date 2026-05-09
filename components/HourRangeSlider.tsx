import { colors } from "@/constants/tokens";
import React, { useRef, useState } from "react";
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  View,
} from "react-native";

type Props = {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
};

const HANDLE_SIZE = 22;
const TRACK_HEIGHT = 4;
const TRACK_VERTICAL_PADDING = (HANDLE_SIZE - TRACK_HEIGHT) / 2;

export default function HourRangeSlider({ value, onChange, min = 0, max = 24, step = 1 }: Props) {
  const [trackWidth, setTrackWidth] = useState(0);
  const trackWidthRef = useRef(0);
  const valueRef = useRef(value);
  valueRef.current = value;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const grabPosRef = useRef(0);
  const propsRef = useRef({ min, max, step });
  propsRef.current = { min, max, step };

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    trackWidthRef.current = w;
    setTrackWidth(w);
  };

  const startResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        const w = trackWidthRef.current;
        const { min: lo, max: hi } = propsRef.current;
        const [s] = valueRef.current;
        grabPosRef.current = w > 0 ? ((s - lo) / (hi - lo)) * w : 0;
      },
      onPanResponderMove: (_: GestureResponderEvent, g: PanResponderGestureState) => {
        const w = trackWidthRef.current;
        if (w <= 0) return;
        const { min: lo, max: hi, step: st } = propsRef.current;
        const [s, e] = valueRef.current;
        const newPos = grabPosRef.current + g.dx;
        const clamped = Math.max(0, Math.min(w, newPos));
        const raw = (clamped / w) * (hi - lo) + lo;
        const newValue = Math.max(lo, Math.min(hi, Math.round(raw / st) * st));
        const next = Math.min(newValue, e);
        if (next !== s) onChangeRef.current([next, e]);
      },
    }),
  ).current;

  const endResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        const w = trackWidthRef.current;
        const { min: lo, max: hi } = propsRef.current;
        const [, e] = valueRef.current;
        grabPosRef.current = w > 0 ? ((e - lo) / (hi - lo)) * w : 0;
      },
      onPanResponderMove: (_: GestureResponderEvent, g: PanResponderGestureState) => {
        const w = trackWidthRef.current;
        if (w <= 0) return;
        const { min: lo, max: hi, step: st } = propsRef.current;
        const [s, e] = valueRef.current;
        const newPos = grabPosRef.current + g.dx;
        const clamped = Math.max(0, Math.min(w, newPos));
        const raw = (clamped / w) * (hi - lo) + lo;
        const newValue = Math.max(lo, Math.min(hi, Math.round(raw / st) * st));
        const next = Math.max(newValue, s);
        if (next !== e) onChangeRef.current([s, next]);
      },
    }),
  ).current;

  const valueToPos = (v: number) => (trackWidth > 0 ? ((v - min) / (max - min)) * trackWidth : 0);
  const startX = valueToPos(value[0]);
  const endX = valueToPos(value[1]);

  return (
    <View style={styles.container} onLayout={onLayout}>
      <View style={styles.track} />
      {trackWidth > 0 && (
        <>
          <View style={[styles.fill, { left: startX, width: Math.max(0, endX - startX) }]} />
          <View
            {...startResponder.panHandlers}
            style={[styles.handle, { left: startX - HANDLE_SIZE / 2 }]}
            hitSlop={16}
          />
          <View
            {...endResponder.panHandlers}
            style={[styles.handle, { left: endX - HANDLE_SIZE / 2 }]}
            hitSlop={16}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: HANDLE_SIZE,
    justifyContent: "center",
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: colors.whiteA10,
  },
  fill: {
    position: "absolute",
    top: TRACK_VERTICAL_PADDING,
    height: TRACK_HEIGHT,
    backgroundColor: colors.primary,
    borderRadius: TRACK_HEIGHT / 2,
  },
  handle: {
    position: "absolute",
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: HANDLE_SIZE / 2,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.bgPanel,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
});
