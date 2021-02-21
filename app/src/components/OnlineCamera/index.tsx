import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Camera, CameraCapturedPicture } from "expo-camera";
import { postImage } from "../../api/prediction";
import { ImageResult } from "../util/image";
import * as ImageManipulator from "expo-image-manipulator";
import { labels } from "../util/label";

export interface OnlineCameraProps {
  setSign: React.Dispatch<React.SetStateAction<number>>;
}

export const OnlineCamera: React.FC<OnlineCameraProps> = ({ setSign }) => {
  const cameraRef = useRef<Camera>(null);
  const [loop, setLoop] = useState(true);

  useEffect(() => {
    return () => {
      setLoop(false);
    };
  }, []);

  const loopRequests = async () => {
    console.log("loop");
    while (loop) {
      console.log("started");
      await takePicture();
    }
  };

  const takePicture = async () => {
    await cameraRef.current?.takePictureAsync({
      onPictureSaved: (pic) => sendImage(pic),
    });
  };

  const sendImage = async (img: CameraCapturedPicture | undefined) => {
    try {
      console.time("photo");
      if (!img?.uri) return;

      console.log("after image");

      const newImg = await ImageManipulator.manipulateAsync(
        img.uri,
        [{ resize: { height: 1080, width: 1920 } }],
        { compress: 0.35, base64: true }
      );

      console.log("after mani");
      console.timeEnd("photo");
      if (newImg.base64) {
        console.time("request");
        const result: ImageResult = await postImage(newImg.base64);
        console.timeEnd("request");
        const idx = result.detection_scores.indexOf(
          Math.max(...result.detection_scores)
        );
        if (result.detection_scores[idx] >= 0.8) {
          setSign(result.detection_classes[idx]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        ref={cameraRef}
        onCameraReady={loopRequests}
      ></Camera>
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
