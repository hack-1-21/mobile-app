import { Image } from "react-native";

type PlayerAvatarIconProps = {
  size?: number;
  src?: string;
};

export function PlayerAvatarIcon({
  size = 96,
  src = "https://api.dicebear.com/9.x/thumbs/svg",
}: PlayerAvatarIconProps) {
  return (
    <Image source={{ uri: src }} style={{ width: size, height: size }} />
  );
}
