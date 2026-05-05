import Svg, { Path, type SvgProps } from "react-native-svg";

type PencilIconProps = SvgProps & {
  size?: number;
  color?: string;
};

export function PencilIcon({ size = 32, color = "#FFFFFF", ...props }: PencilIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <Path d="M34 4h14.4899v28.9797H34z" fill={color} transform="rotate(45 34 4)" />
      <Path d="m8.3853 39.8606 3.2478-12.121 8.8732 8.8732-12.121 3.2478Z" fill={color} />
    </Svg>
  );
}
