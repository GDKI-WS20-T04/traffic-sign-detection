import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";

export const Home = () => {
  return (
    <View>
      <Button
        icon="camera"
        mode="contained"
        onPress={() => console.log("Pressed")}
      >
        Press me
      </Button>
    </View>
  );
};
