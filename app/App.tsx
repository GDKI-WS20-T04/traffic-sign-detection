import { StatusBar } from "expo-status-bar";
import React, { Component, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";

export default function App() {
  const [isTfReady, setIsTfReady] = useState(false);

  useEffect(() => {
    const initTf = async () => {
      // Wait for tf to be ready.
      await tf.ready();
      // Signal to the app that tensorflow.js can now be used.
      setIsTfReady(true);
    };

    initTf();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
      {isTfReady && <Text>Tf Ready</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
