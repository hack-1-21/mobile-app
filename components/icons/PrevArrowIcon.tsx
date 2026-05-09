import Svg, { Path, type SvgProps } from "react-native-svg";

type PrevArrowIconProps = SvgProps & {
  size?: number;
  color?: string;
};

export function PrevArrowIcon({ size = 48, color = "#676767", ...props }: PrevArrowIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <Path
        d="M7.87096 21.7651C6.15053 22.7584 6.15054 25.2416 7.87097 26.2349L30.129 39.0856C31.8495 40.0789 34 38.8373 34 36.8507L34 11.1493C34 9.16273 31.8495 7.92112 30.129 8.91441L7.87096 21.7651Z"
        fill={color}
      />
    </Svg>
  );
}
