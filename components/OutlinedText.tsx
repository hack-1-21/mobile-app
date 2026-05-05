import { colorTokens, fontFamily, fontSize } from "@/constants/tokens";
import React from "react";
import { Svg, Text as SvgText } from "react-native-svg";

type Props = {
  text: string | number;
  width?: number;
  height?: number;
  baselineY?: number;
  size?: number;
  outerStrokeColor?: string;
  innerStrokeColor?: string;
  fillColor?: string;
  outerStrokeWidth?: number;
  innerStrokeWidth?: number;
  font?: string;
  fontWeight?: string;
};

export function OutlinedText({
  text,
  width,
  height,
  baselineY,
  size = fontSize.maximum,
  outerStrokeColor = colorTokens.primaryForeground,
  innerStrokeColor = colorTokens.hudText,
  fillColor = colorTokens.primaryForeground,
  outerStrokeWidth = 7,
  innerStrokeWidth = 4,
  font = fontFamily.kiwiMaruMedium.fontFamily,
  fontWeight = "500",
}: Props) {
  const value = String(text);
  const measuredWidth = width ?? Math.ceil(value.length * size * 0.62 + outerStrokeWidth);
  const measuredHeight = height ?? Math.ceil(size + outerStrokeWidth + outerStrokeWidth);
  const textX = outerStrokeWidth / 2;
  const textY = baselineY ?? Math.ceil(size + outerStrokeWidth / 2 - 1);

  return (
    <Svg
      width={measuredWidth}
      height={measuredHeight}
      viewBox={`0 0 ${measuredWidth} ${measuredHeight}`}
    >
      <SvgText
        x={textX}
        y={textY}
        fill="none"
        stroke={outerStrokeColor}
        strokeLinejoin="round"
        strokeWidth={outerStrokeWidth}
        fontFamily={font}
        fontSize={size}
        fontWeight={fontWeight}
        textAnchor="start"
      >
        {value}
      </SvgText>
      <SvgText
        x={textX}
        y={textY}
        fill="none"
        stroke={innerStrokeColor}
        strokeLinejoin="round"
        strokeWidth={innerStrokeWidth}
        fontFamily={font}
        fontSize={size}
        fontWeight={fontWeight}
        textAnchor="start"
      >
        {value}
      </SvgText>
      <SvgText
        x={textX}
        y={textY}
        fill={fillColor}
        fontFamily={font}
        fontSize={size}
        fontWeight={fontWeight}
        textAnchor="start"
      >
        {value}
      </SvgText>
    </Svg>
  );
}
