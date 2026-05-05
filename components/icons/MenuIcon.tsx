import Svg, { Rect, type SvgProps } from "react-native-svg";

type MenuIconProps = SvgProps & {
  size?: number;
  color?: string;
};

export function MenuIcon({ size = 48, color = "#676767", ...props }: MenuIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <Rect x="6.3844" y="8.48993" width="34.8" height="7.2" rx="3.5" fill={color} />
      <Rect x="6.3844" y="20.49" width="34.8" height="7.2" rx="3.5" fill={color} />
      <Rect x="6.3844" y="32.4899" width="34.8" height="7.2" rx="3.5" fill={color} />
    </Svg>
  );
}
