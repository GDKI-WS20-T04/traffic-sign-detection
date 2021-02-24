import { StackHeaderTitleProps } from "@react-navigation/stack";
import React from "react";
import { Image, View, Text, StyleSheet } from "react-native";
import { Button, Colors, IconButton } from "react-native-paper";

export const StartHeader: React.FC<StackHeaderTitleProps> = () => {
  return (
    <View style={style.root}>
      <View style={style.textContainer}>
        <Text style={style.text}>Sign Detector</Text>
      </View>
      <View style={style.indicator}>
        <IconButton icon="camera" color={Colors.red500} size={20} />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "row",
  },
  textContainer: {
    textAlign: "center",
    textAlignVertical: "center",
    // backgroundColor: "#585858",
    flex: 1,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  indicator: {
    // backgroundColor: "#32EAFA",
  },
});
