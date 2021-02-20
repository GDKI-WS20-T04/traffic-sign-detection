import React from "react";
import { View, StyleSheet } from "react-native";

export const CustomPaper: React.FC = ({ children }) => {
  return <View style={style.paper}>{children}</View>;
};

const style = StyleSheet.create({
  paper: {
    height: "95%",
    margin: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 5,
  },
});
