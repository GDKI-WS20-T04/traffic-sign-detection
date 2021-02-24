import { StackHeaderTitleProps } from "@react-navigation/stack";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, IconButton } from "react-native-paper";

export interface StartHeaderProps {
  changeDevMode: () => void;
  stackHeaderTitleProps: StackHeaderTitleProps;
  devMode: boolean;
}

export const StartHeader: React.FC<StartHeaderProps> = ({
  devMode,
  changeDevMode,
}) => {
  return (
    <View style={style.root}>
      <View style={style.textContainer}>
        <Text style={style.text}>Sign Detector</Text>
      </View>
      {devMode && (
        <View style={style.textContainer}>
          <Text style={style.devText}>Dev</Text>
        </View>
      )}
      <View>
        <IconButton
          icon="camera"
          color={Colors.red500}
          size={20}
          onPress={() => {}}
          onLongPress={changeDevMode}
          rippleColor="#0000"
        />
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
  devText: {
    color: "#696969",
  },
});
