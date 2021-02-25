import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { LocationGeocodedAddress, LocationObject } from "expo-location";
import { View, StyleSheet } from "react-native";
import { LocationPaper } from "../LocationPaper";
import { SpeedPaper } from "../SpeedPaper";

export interface StartProps {
  devMode: boolean;
}

export const Start: React.FC<StartProps> = ({ devMode }) => {
  const [geo, setGeo] = useState<LocationGeocodedAddress[]>([]);
  const [location, setLocation] = useState<LocationObject | null>(null);

  useEffect(() => {
    let sub: {
      remove(): void;
    };
    const init = async () => {
      sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 500,
        },
        async (loc) => {
          setLocation(loc);
          const address = await Location.reverseGeocodeAsync(loc.coords);
          setGeo(address);
        }
      );
    };
    init();
    return () => {
      sub.remove();
    };
  }, []);

  return (
    <View style={style.root}>
      <View style={{ flex: 2 }}>
        <SpeedPaper location={location} devMode={devMode} />
      </View>
      <View style={{ flex: 1 }}>
        <LocationPaper location={geo} />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "row",
  },
});
