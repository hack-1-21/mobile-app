import Svg, { Path, type SvgProps } from "react-native-svg";

type PinIconProps = SvgProps & {
  size?: number;
  color?: string;
};

export function PinIcon({ size = 48, color = "#676767", ...props }: PinIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <Path
        d="M23.8203 5C32.0052 5.00002 38.6406 11.6354 38.6406 19.8203C38.6403 28.0052 24.6062 42.9996 23.8203 43C23.0349 43 9.0003 28.0053 9 19.8203C9 11.6354 15.6354 5 23.8203 5ZM23.8203 12.2051C19.6706 12.2051 16.3066 15.569 16.3066 19.7188C16.3067 23.8685 19.6706 27.2324 23.8203 27.2324C27.9701 27.2324 31.334 23.8685 31.334 19.7188C31.334 15.569 27.9701 12.2051 23.8203 12.2051Z"
        fill={color}
      />
    </Svg>
  );
}
