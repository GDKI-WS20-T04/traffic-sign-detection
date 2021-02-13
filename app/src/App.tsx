import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { registerRootComponent } from "expo";
import { Provider as PaperProvider } from "react-native-paper";
import { Home } from "./components/Home";

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
    <PaperProvider>
      <View style={styles.container}>
        <Home></Home>
        <StatusBar style="auto" />
      </View>
    </PaperProvider>
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

registerRootComponent(App);
