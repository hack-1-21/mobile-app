import Svg, { Path, type SvgProps } from "react-native-svg";

type WrenchIconProps = SvgProps & {
  size?: number;
  color?: string;
};

export function WrenchIcon({ size = 48, color = "#676767", ...props }: WrenchIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <Path
        d="M41.7714 12.0148C43.0875 15.5651 42.3219 19.7121 39.4692 22.5648C36.6166 25.4174 32.4702 26.1823 28.9199 24.8663L11.7601 42.0261L5.86919 36.1352L23.029 18.9754C21.7129 15.4252 22.4778 11.2788 25.3305 8.42611C28.1833 5.57336 32.3301 4.80774 35.8805 6.12387L29.4544 12.55L35.3453 18.4409L41.7714 12.0148Z"
        fill={color}
      />
    </Svg>
  );
}
