import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Camera, CameraCapturedPicture } from "expo-camera";
import { postImage } from "../../api/prediction";
import { ImageResult } from "../util/image";
import * as ImageManipulator from "expo-image-manipulator";
import { checkSize } from "../util/prediction";

export interface OnlineCameraProps {
  setSign: React.Dispatch<React.SetStateAction<number>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

export const OnlineCamera: React.FC<OnlineCameraProps> = ({
  setSign,
  setScore,
}) => {
  const cameraRef = useRef<Camera>(null);
  const [loop, setLoop] = useState(true);

  useEffect(() => {
    return () => {
      setLoop(false);
    };
  }, []);

  const loopRequests = async () => {
    while (loop) {
      console.log("started");
      await takePicture();
    }
  };

  const takePicture = async () => {
    console.time("photo");
    await cameraRef.current?.takePictureAsync({
      skipProcessing: true,
      onPictureSaved: (pic) => sendImage(pic),
    });
  };

  const sendImage = async (img: CameraCapturedPicture | undefined) => {
    try {
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
        const idx = result.detection_scores.indexOf(
          Math.max(...result.detection_scores)
        );

        if (
          result.detection_scores[idx] >= 0.8 &&
          !checkSize(result.detection_boxes[idx])
        ) {
          setSign(result.detection_classes[idx]);
          setScore(result.detection_scores[idx]);
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
