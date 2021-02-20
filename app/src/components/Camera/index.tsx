import React, { useEffect, useState } from "react";
import { Camera as ExpoCamera } from "expo-camera";
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";
import { StyleSheet, Platform, View } from "react-native";
import { ExpoWebGLRenderingContext } from "expo-gl";
import * as tf from "@tensorflow/tfjs";
import { Button, Switch, Text } from "react-native-paper";
import "react-native-console-time-polyfill";
import { predictImage, predictVideoImage } from "../util/prediction";
import { Tensor3D } from "@tensorflow/tfjs-core";
import { loadModel } from "../util/model";
const TensorCamera = cameraWithTensors(ExpoCamera);

export const Camera = () => {
  const [isTfReady, setIsTfReady] = useState(false);
  const [model, setModel] = useState<undefined | tf.GraphModel>();
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  useEffect(() => {
    const initTf = async () => {
      // Wait for tf to be ready.
      await tf.ready();
      console.log(tf.getBackend());

      setModel(await loadModel());

      // Signal to the app that tensorflow.js can now be used.
      setIsTfReady(true);
    };

    initTf();
  }, []);

  const handleCameraStream = (
    images: IterableIterator<Tensor3D>,
    updateCameraPreview: () => void,
    gl: ExpoWebGLRenderingContext
  ) => {
    // TODO needent? detectGLCapabilities(gl);
    const skip = 500;
    let i = 0;

    const loop = async () => {
      const nextImageTensor = images.next().value;

      if (i % skip === 0) predictVideoImage(model, nextImageTensor);

      i = ++i % skip;
      requestAnimationFrame(loop);
    };
    loop();
  };

  const handlePress = () => {
    predictImage(model);
  };

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  let textureDims;
  if (Platform.OS === "ios") {
    textureDims = {
      height: 1920,
      width: 1080,
    };
  } else {
    textureDims = {
      height: 1200,
      width: 1600,
    };
  }

  const renderPrediction = (
    <>
      {isSwitchOn ? (
        <TensorCamera
          // Standard Camera props
          style={styles.camera}
          type={ExpoCamera.Constants.Type.back}
          // Tensor related props
          cameraTextureHeight={textureDims.height}
          cameraTextureWidth={textureDims.width}
          resizeHeight={200}
          resizeWidth={152}
          resizeDepth={3}
          onReady={handleCameraStream}
          autorender={true}
        />
      ) : (
        <Button onPress={handlePress}>
          <Text>Check</Text>
        </Button>
      )}
    </>
  );

  return (
    <View>
      <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
      {isTfReady ? <>{renderPrediction}</> : <Text>Loading...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  camera: {
    width: 700 / 2,
    height: 800 / 2,
    zIndex: 1,
    borderWidth: 0,
    borderRadius: 0,
  },
});
