import { LocationObject } from "expo-location";
import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Text, Image, Dimensions } from "react-native";
import { OnlineCamera } from "../OnlineCamera";
import { CustomPaper } from "../util/CustomPaper";
import { labels } from "../util/label";
import { Audio } from "expo-av";
import { ChangeSpeed } from "./ChangeTempoLimit";
import { Snackbar } from "react-native-paper";

export interface SpeedPaperProps {
  location: LocationObject | null;
  devMode: boolean;
}

export const SpeedPaper: React.FC<SpeedPaperProps> = ({
  location,
  devMode,
}) => {
  const tolerance: number = 5;
  const [sign, setSign] = useState<number>(0);
  const height = Dimensions.get("window").width;
  const [testSpeed, setTestSpeed] = useState(0);
  const [error, setError] = useState(false);
  const [memSpeedLimit, setMemSpeedLimit] = useState(
    Number.MAX_SAFE_INTEGER - 1
  );

  const speedLimit = useMemo(() => {
    if (labels[sign].value === -1) {
      return memSpeedLimit;
    } else {
      const baseSpeed: number | undefined = labels[sign].baseSpeed;
      if (baseSpeed) setMemSpeedLimit(baseSpeed);
      return labels[sign].value;
    }
  }, [sign]);

  const speed = useMemo(
    () =>
      location?.coords.speed
        ? (Math.round(location?.coords.speed * 3.6 + Number.EPSILON) * 100) /
          100
        : 0,
    [location?.coords.speed]
  );

  const getSpeed = () => (devMode ? testSpeed : speed);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/sounds/warning.mp3")
    );
    console.log("sound loaded");

    sound?.playAsync();
  };

  useEffect(() => {
    if (getSpeed() > speedLimit + tolerance) {
      playSound();
    }
  }, [speed, testSpeed, speedLimit]);

  const renderLimit = () => {
    switch (speedLimit) {
      case Number.MAX_SAFE_INTEGER - 1:
        return <Text style={style.speed}>-</Text>;
      case Number.MAX_SAFE_INTEGER:
        return (
          <Image
            style={{ width: 30, height: 30, marginTop: 10 }}
            source={labels[23].image}
          />
        );
      default:
        return <Text style={style.speed}>{speedLimit}</Text>;
    }
  };

  return (
    <View style={style.root}>
      <CustomPaper>
        <View style={style.snackbarContainer}>
          <Snackbar visible={error} onDismiss={() => {}} style={style.snackbar}>
            No connection to the server
          </Snackbar>
        </View>
        {getSpeed() > speedLimit + tolerance ? (
          <View style={style.warning}></View>
        ) : null}
        <View style={style.camera}>
          <OnlineCamera setSign={setSign} setError={setError} />
        </View>
        <View style={style.content}>
          {devMode && (
            <ChangeSpeed testSpeed={testSpeed} setTestSpeed={setTestSpeed} />
          )}
          <View style={style.signView}>
            <Image
              style={{ width: height / 4, height: height / 4 }}
              source={labels[sign].image}
            ></Image>
          </View>
          <View style={style.speedContainer}>
            <View style={{ flex: 1 }}>
              <Text style={style.textColor}>Geschwindigkeit: </Text>
              <Text style={style.speed}>{getSpeed()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={style.textColor}>Tempolimit: </Text>
              {renderLimit()}
            </View>
          </View>
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
  content: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    padding: 10,
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
    marginLeft: 10,
  },
  warning: {
    backgroundColor: "rgba(255, 0, 0, 0.4)",
    position: "absolute",
    height: "100%",
    width: "100%",
    zIndex: 2,
  },
  signView: {
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    height: "100%",
    opacity: 0,
  },
  snackbarContainer: {
    position: "absolute",
    zIndex: 3,
    top: 62,
    display: "flex",
    width: "100%",
    flex: 1,
  },
  snackbar: {
    backgroundColor: "#f44336",
  },
});
