import Svg, { Path, type SvgProps } from "react-native-svg";

type StarLineIconProps = SvgProps & {
  size?: number;
  fillColor?: string;
  strokeColor?: string;
};

export function StarLineIcon({
  size = 48,
  fillColor = "#FFFFFF",
  strokeColor = "#676767",
  ...props
}: StarLineIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <Path
        d="M27.5986 9.08203C26.4605 5.63958 21.5395 5.63958 20.4014 9.08203L17.9561 16.4785C17.8574 16.7768 17.5627 17.002 17.2051 17.002H9.29102C5.67753 17.002 4.04622 21.6252 7.0752 23.7881L13.4775 28.3594C13.7513 28.5549 13.8528 28.8873 13.7559 29.1807L11.3105 36.5771C10.1405 40.116 14.2309 42.8476 17.125 40.7812L23.5273 36.21C23.8073 36.0101 24.1927 36.0101 24.4727 36.21L30.875 40.7812C33.7691 42.8476 37.8595 40.116 36.6895 36.5771L34.2441 29.1807C34.1472 28.8873 34.2487 28.5549 34.5225 28.3594L40.9248 23.7881C43.9538 21.6252 42.3225 17.002 38.709 17.002H30.7949C30.4373 17.002 30.1426 16.7768 30.0439 16.4785L27.5986 9.08203Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={3}
      />
    </Svg>
  );
}

