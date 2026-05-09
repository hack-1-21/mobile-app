import Svg, { Path, type SvgProps } from "react-native-svg";

type FullscreenIconProps = SvgProps & {
  size?: number;
  color?: string;
};

export function FullscreenIcon({ size = 48, color = "#676767", ...props }: FullscreenIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <Path
        d="M10 18 V10 H18 M30 10 H38 V18 M38 30 V38 H30 M18 38 H10 V30"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
