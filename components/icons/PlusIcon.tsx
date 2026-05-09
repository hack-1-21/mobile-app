import Svg, { Path, type SvgProps } from "react-native-svg";

type PlusIconProps = SvgProps & {
  size?: number;
  color?: string;
};

export function PlusIcon({ size = 48, color = "#676767", ...props }: PlusIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <Path
        d="M23.9992 5C27.4146 5 30.1834 7.76872 30.1834 11.1841V17.8151H36.8159C40.2309 17.8156 43 20.5841 43 23.9992C43 27.4143 40.2309 30.1829 36.8159 30.1834H30.1834V36.8159C30.1829 40.2309 27.4143 43 23.9992 43C20.5841 43 17.8156 40.2309 17.8151 36.8159V30.1834H11.1841C7.76872 30.1834 5 27.4146 5 23.9992C5 20.5839 7.76872 17.8151 11.1841 17.8151H17.8151V11.1841C17.8151 7.76872 20.5839 5 23.9992 5Z"
        fill={color}
      />
    </Svg>
  );
}
