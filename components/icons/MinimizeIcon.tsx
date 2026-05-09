import Svg, { Path, type SvgProps } from "react-native-svg";

type MinimizeIconProps = SvgProps & {
  size?: number;
  color?: string;
};

export function MinimizeIcon({ size = 48, color = "#676767", ...props }: MinimizeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <Path d="M14.333 32.667H7V29H18V40H14.333V32.667Z" fill={color} />
      <Path d="M33.667 32.667H41V29H30V40H33.667V32.667Z" fill={color} />
      <Path d="M33.667 15.333H41V19H30V8H33.667V15.333Z" fill={color} />
      <Path d="M14.333 15.333H7V19H18V8H14.333V15.333Z" fill={color} />
    </Svg>
  );
}
