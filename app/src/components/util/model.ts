import * as tf from "@tensorflow/tfjs";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";

export const loadModel = async () => {
  const jsonModel = require("../../assets/v5-detector_3/model.json");
  const weihts = [
    require("../../assets/v5-detector_3/group1-shard1of2.bin"),
    require("../../assets/v5-detector_3/group1-shard2of2.bin"),
  ];

  return await tf.loadGraphModel(bundleResourceIO(jsonModel, weihts));
};
