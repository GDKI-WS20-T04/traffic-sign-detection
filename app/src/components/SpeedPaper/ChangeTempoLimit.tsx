import React from "react";
import { Button } from "react-native-paper";
import { View, StyleSheet } from "react-native";

export interface ChangeTempoLimitProps {
  testSpeed: number;
  setTestSpeed: React.Dispatch<React.SetStateAction<number>>;
}

export const ChangeSpeed: React.FC<ChangeTempoLimitProps> = ({
  testSpeed,
  setTestSpeed,
}) => {
  const handleSetTestSpeed = (speed: number) => () => {
    setTestSpeed(speed);
  };

  const tempoBtns = [0, 36, 56, 126];

  return (
    <View style={style.root}>
      {tempoBtns.map((s) => (
        <Button
          style={style.btn}
          mode="outlined"
          onPress={handleSetTestSpeed(s)}
          key={s}
        >
          Tempo = {s}
        </Button>
      ))}
    </View>
  );
};

const style = StyleSheet.create({
  root: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    left: 4,
  },
  btn: {
    margin: 4,
    zIndex: 2,
  },
});
