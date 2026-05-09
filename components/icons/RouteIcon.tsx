import Svg, { Circle, Path, type SvgProps } from "react-native-svg";

type RouteIconProps = SvgProps & {
  size?: number;
  color?: string;
};

export function RouteIcon({ size = 48, color = "#676767", ...props }: RouteIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <Circle cx="13" cy="13" r="5" stroke={color} strokeWidth={4} />
      <Circle cx="35" cy="35" r="5" stroke={color} strokeWidth={4} />
      <Path
        d="M18 13H27C31.4183 13 35 16.5817 35 21C35 25.4183 31.4183 29 27 29H21C18.7909 29 17 30.7909 17 33C17 35.2091 18.7909 37 21 37H30"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
