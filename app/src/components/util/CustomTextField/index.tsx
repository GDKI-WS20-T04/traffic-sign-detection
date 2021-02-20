import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Subheading } from "react-native-paper";

export interface CustomTextFieldProps {
  heading: string;
  text: string;
}

export const CustomTextField: React.FC<CustomTextFieldProps> = ({
  heading,
  text,
}) => {
  return (
    <View>
      <Text style={style.textColor}>{heading}</Text>
      <Subheading style={style.textSubheading}>{text}</Subheading>
    </View>
  );
};

const style = StyleSheet.create({
  textColor: {
    color: "#585858",
  },
  textSubheading: {
    fontWeight: "bold",
  },
});
