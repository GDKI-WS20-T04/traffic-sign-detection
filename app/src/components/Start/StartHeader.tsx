import { StackHeaderTitleProps } from "@react-navigation/stack";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, IconButton } from "react-native-paper";

export const StartHeader: React.FC<StackHeaderTitleProps> = () => {
  return (
    <View style={style.root}>
      <View style={style.textContainer}>
        <Text style={style.text}>Sign Detector</Text>
      </View>
      <View>
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
    flex: 1,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
