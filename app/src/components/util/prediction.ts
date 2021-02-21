import { getLabels, PredictionResult } from "./label";
import * as tf from "@tensorflow/tfjs";
import { decodeJpeg, fetch } from "@tensorflow/tfjs-react-native";
import { Image } from "react-native";

export const predict = async (
  model: tf.GraphModel | undefined,
  nextImageTensor: any
): Promise<PredictionResult[]> => {
  if (!model) return [];

  console.time("t");
  const res = ((await model?.executeAsync(
    nextImageTensor?.expandDims(0)
  )) as any) as tf.Tensor[];
  console.timeEnd("t");

  const classes = res[1].dataSync() as Float32Array;
  const scores = res[5].dataSync() as Float32Array;

  return getLabels(classes, scores);
};

export const predictVideoImage = async (
  model: tf.GraphModel | undefined,
  nextImageTensor: any
) => {
  const res = await predict(model, nextImageTensor);

  console.log("Result: ", res);
};

export const predictImage = async (model?: tf.GraphModel) => {
  if (!model) return;

  console.log("start");
  // Load an image as a Uint8Array
  const imageUri = Image.resolveAssetSource(
    require("../../assets/v5-detector_3/test_image.jpg")
  ).uri;
  const response = await fetch(imageUri, {}, { isBinary: true });
  const imageDataArrayBuffer = await response.arrayBuffer();
  const imageData = new Uint8Array(imageDataArrayBuffer);

  // Decode image data to a tensor
  const imageTensor = decodeJpeg(imageData);

  const res = await predict(model, imageTensor);
  console.log("finished: ", res);
};
