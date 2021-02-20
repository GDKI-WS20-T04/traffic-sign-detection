import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { View, Text } from "react-native";
import { LocationGeocodedAddress, LocationObject } from "expo-location";
import { LocationPaper } from "../LocationPaper";

export const SpeedDisplay = () => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [geo, setGeo] = useState<LocationGeocodedAddress[]>([]);

  return (
    <View>
      <Text>
        {location?.coords.speed
          ? (Math.round(location?.coords.speed * 3.6 + Number.EPSILON) * 100) /
            100
          : 0}
      </Text>
      <LocationPaper location={geo}></LocationPaper>
    </View>
  );
};
