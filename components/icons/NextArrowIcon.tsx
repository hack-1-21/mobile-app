import Svg, { Path, type SvgProps } from "react-native-svg";

type NextArrowIconProps = SvgProps & {
  size?: number;
  color?: string;
};

export function NextArrowIcon({ size = 48, color = "#676767", ...props }: NextArrowIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <Path
        d="M40.129 21.7651C41.8495 22.7584 41.8495 25.2416 40.129 26.2349L17.871 39.0856C16.1505 40.0789 14 38.8373 14 36.8507L14 11.1493C14 9.16273 16.1505 7.92112 17.871 8.91441L40.129 21.7651Z"
        fill={color}
      />
    </Svg>
  );
}
