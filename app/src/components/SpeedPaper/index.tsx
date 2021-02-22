import { LocationObject } from "expo-location";
import React, { useState } from "react";
import { View, StyleSheet, Text, Image, Dimensions } from "react-native";
import { OnlineCamera } from "../OnlineCamera";
import { CustomPaper } from "../util/CustomPaper";
import { labels } from "../util/label";

export interface SpeedPaperProps {
  location: LocationObject | null;
}

export const SpeedPaper: React.FC<SpeedPaperProps> = ({ location }) => {
  const [sign, setSign] = useState<number>(32);

  return (
    <View style={style.root}>
      <CustomPaper>
        {/*<View style={style.warning}></View>*/}
        <View style={style.camera}>
          <OnlineCamera setSign={setSign} />
        </View>
        <View style={style.content}>
          <View style={style.signView}>
            <Image style={style.sign} source={labels[sign].image}></Image>
          </View>
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
        </View>
      </CustomPaper>
    </View>
  );
};

const height = Dimensions.get("window").width;

const style = StyleSheet.create({
  root: {
    height: "100%",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
  },
  content: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
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
    marginLeft: 10,
  },
  warning: {
    backgroundColor: "rgba(255, 0, 0, 0.4)",
    position: "absolute",
    height: "100%",
    width: "100%",
    zIndex: 2,
  },
  sign: {
    width: height / 4,
    height: height / 4,
    //transform: [{ scale: 0.42 }, { translateX: -120 }, { translateY: -400 }],
  },
  signView: {
    height: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    //position: "absolute",
    //zIndex: -1,
    height: "100%",
    opacity: 0,
  },
});
