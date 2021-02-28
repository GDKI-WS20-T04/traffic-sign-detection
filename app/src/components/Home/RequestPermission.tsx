import { PermissionResponse } from "expo-permissions";
import React from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, Text, Colors, Button } from "react-native-paper";

export interface RequestPermissionProps {
  permission: PermissionResponse | undefined;
  askForPermission: () => void;
}

export const RequestPermission: React.FC<RequestPermissionProps> = ({
  permission,
  askForPermission,
  children,
}) => {
  if (!permission || permission.status !== "granted") {
    return (
      <View style={style.root}>
        <IconButton icon="alert" color={Colors.red500} size={40} />
        <Text style={style.text}>
          Camera or location permission is not granted
        </Text>
        <Button mode="outlined" onPress={askForPermission}>
          Grant permission
        </Button>
      </View>
    );
  }

  return <>{children}</>;
};

const style = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginBottom: 20,
  },
});
