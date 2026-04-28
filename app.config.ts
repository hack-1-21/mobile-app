import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name ?? "sound-collect",
  slug: config.slug ?? "sound-collect",
  ios: {
    ...config.ios,
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY_IOS ?? "",
    },
    infoPlist: {
      ...config.ios?.infoPlist,
      NSLocationWhenInUseUsageDescription:
        "現在地を地図上に表示するために使用します。",
    },
  },
  android: {
    ...config.android,
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY_ANDROID ?? "",
      },
    },
  },
});
