import React, { useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Camera, CameraCapturedPicture } from "expo-camera";
import { postImage } from "../../api/prediction";
import { ImageResult } from "../util/image";
import * as ImageManipulator from "expo-image-manipulator";

export const OnlineCamera: React.FC = () => {
  const cameraRef = useRef<Camera>(null);

  const sendImage = async () => {
    console.time("photo");
    const img:
      | CameraCapturedPicture
      | undefined = await cameraRef.current?.takePictureAsync({});

    if (!img?.uri) return;

    const newImg = await ImageManipulator.manipulateAsync(
      img.uri,
      [{ resize: { height: 1080, width: 1920 } }],
      { compress: 0.35, base64: true }
    );

    console.timeEnd("photo");
    if (newImg.base64) {
      console.time("request");
      const result: ImageResult = await postImage(newImg.base64);
      console.timeEnd("request");
      console.log(result);
    }
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              sendImage();
            }}
          >
            <Text>HAllo</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});
