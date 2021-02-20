import { LocationObject } from "expo-location";
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { CustomPaper } from "../util/CustomPaper";

export interface SpeedPaperProps {
  location: LocationObject | null;
}

export const SpeedPaper: React.FC<SpeedPaperProps> = ({ location }) => {
  return (
    <View style={style.root}>
      <CustomPaper>
        {<View style={style.warning}></View>}
        <View style={style.speedContainer}>
          <Text style={style.textColor}>Geschwindigkeit: </Text>
          <Text style={style.speed}>
            {location?.coords.speed
              ? (Math.round(location?.coords.speed * 3.6 + Number.EPSILON) *
                  100) /
                100
              : 0}
          </Text>
        </View>
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
  textColor: {
    color: "#585858",
  },
  speed: {
    fontWeight: "bold",
    fontSize: 30,
  },
  speedContainer: {
    flexDirection: "row",
    alignItems: "center",
    bottom: 0,
  },
  warning: {
    backgroundColor: "rgba(255, 0, 0, 0.4)",
    position: "absolute",
    height: "100%",
    width: "100%",
    zIndex: 2,
  },
});
