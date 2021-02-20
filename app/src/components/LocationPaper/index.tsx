import { LocationGeocodedAddress } from "expo-location";
import React from "react";
import { View, StyleSheet } from "react-native";
import { CustomPaper } from "../util/CustomPaper";
import { CustomTextField } from "../util/CustomTextField";

export interface LocationPaperProps {
  location: LocationGeocodedAddress[];
}

export const LocationPaper: React.FC<LocationPaperProps> = ({ location }) => {
  return (
    <View style={style.root}>
      <CustomPaper>
        {location.map((l, idx) => (
          <View key={idx}>
            <CustomTextField heading="Land" text={l.country ?? ""} />
            <CustomTextField heading="Bundesland" text={l.region ?? ""} />
            <CustomTextField heading="Ort" text={l.city ?? ""} />
            <CustomTextField heading="Straße" text={l.street ?? ""} />
          </View>
        ))}
      </CustomPaper>
    </View>
  );
};

const style = StyleSheet.create({
  root: {
    height: "100%",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
  },
});
