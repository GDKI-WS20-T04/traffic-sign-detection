import { usePermissions } from "expo-permissions";
import React from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import * as Permissions from "expo-permissions";
import { Camera } from "../Camera";

export const Home = () => {
  const [permission, askForPermission] = usePermissions(
    [Permissions.CAMERA, Permissions.LOCATION],
    {
      ask: true,
    }
  );

  if (!permission || permission.status !== "granted") {
    return (
      <View>
        <Text>Permission is not granted</Text>
        <Button onPress={askForPermission}>Grant permission</Button>
      </View>
    );
  }

  return (
    <View>
      <Camera />
    </View>
  );
};
