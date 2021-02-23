import { LocationObject } from "expo-location";
import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Text, Image, Dimensions } from "react-native";
import { Button } from "react-native-paper";
import { OnlineCamera } from "../OnlineCamera";
import { CustomPaper } from "../util/CustomPaper";
import { labels } from "../util/label";
import { Audio } from "expo-av";

export interface SpeedPaperProps {
  location: LocationObject | null;
}

export const SpeedPaper: React.FC<SpeedPaperProps> = ({ location }) => {
  const tolerance: number = 5;
  const [sign, setSign] = useState<number>(0);
  const height = Dimensions.get("window").width;
  const [score, setScore] = useState(0);
  const [testSpeed, setTestSpeed] = useState(0);
  const [soundFile, setSoundFile] = useState<Audio.Sound>();
  const [memSpeedLimit, setMemSpeedLimit] = useState(Number.MAX_SAFE_INTEGER);

  const speedLimit = useMemo(() => {
    if (labels[sign].value === -1) {
      return memSpeedLimit;
    } else {
      setMemSpeedLimit(labels[sign].value);
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

  useEffect(() => {
    const init = async () => {
      console.time("sound");
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/warning.mp3")
      );
      setSoundFile(sound);
      console.timeEnd("sound");
    };
    init();
  }, []);

  useEffect(() => {
    if (testSpeed + tolerance > speedLimit) {
      soundFile?.playAsync();
    }
  }, [speed]);

  return (
    <View style={style.root}>
      <CustomPaper>
        {testSpeed + tolerance > speedLimit ? (
          <View style={style.warning}></View>
        ) : null}
        <View style={style.camera}>
          <OnlineCamera setSign={setSign} setScore={setScore} />
        </View>
        <View style={style.content}>
          <Button
            style={{ position: "absolute" }}
            mode="outlined"
            onPress={() => setTestSpeed(45)}
          >
            Tempo = 45
          </Button>
          <View style={style.signView}>
            <Image
              style={{ width: height / 4, height: height / 4 }}
              source={labels[sign].image}
            ></Image>
          </View>
          <View style={style.speedContainer}>
            <Text style={style.textColor}>Geschwindigkeit: </Text>
            <Text style={style.speed}>{testSpeed}</Text>
            <Text style={style.textColor}>Score: </Text>
            <Text style={style.speed}>{score}</Text>
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
