import { StyleSheet } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";

export default function Index() {
  return (
    <MapView
      style={StyleSheet.absoluteFillObject}
      showsUserLocation
      initialRegion={{
        latitude: 35.6812,
        longitude: 139.7671,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      <Marker
        coordinate={{
          latitude: 35.6812,
          longitude: 139.7671,
        }}
      />
      <Polygon
        coordinates={[
          { latitude: 35.6812, longitude: 139.7671 },
          { latitude: 35.6812, longitude: 139.7771 },
          { latitude: 35.6912, longitude: 139.7771 },
          { latitude: 35.6912, longitude: 139.7671 },
        ]}
        strokeColor="blue"
        fillColor="rgba(0, 0, 255, 0.3)"
      />
    </MapView>
  );
}
