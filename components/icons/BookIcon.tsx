import Svg, { Path, type SvgProps } from "react-native-svg";

type BookIconProps = SvgProps & {
  size?: number;
  color?: string;
};

export function BookIcon({ size = 48, color = "#676767", ...props }: BookIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <Path
        d="M4.02031 7.5L22.8775 12.2143V40.5C19.1954 39.5795 13.4489 38.1429 13.4489 38.1429L4.02031 35.7857V7.5Z"
        fill={color}
      />
      <Path
        d="M43.6203 7.5L24.7632 12.2143V40.5C28.4453 39.5795 34.1917 38.1429 34.1917 38.1429L43.6203 35.7857V7.5Z"
        fill={color}
      />
    </Svg>
  );
}
