# Tensorflow JS

Um die trainierte KI in React Native zu verwenden, war unsere erste Idee [Tensorflow Js](https://www.tensorflow.org/js)
zu verwenden. Da diese seit dem 04.02.2020[^1] eine Offiziell Unterstützung für **React Native** bietet.

## Konvertierung

Um ein Tensorflow modell in Tensorflow Js zu verwenden, muss dieses erst in ein Format konvertiert werden, welches
Tensorflow Js verwenden kann. Hierfür bietet Tensorflow
einen [Converter](https://www.tensorflow.org/js/guide/conversion) an.

![TensorflowJS Konvertierung](../assets/images/app/convert_tensorflow_js.png){: style="height:350px;width:600px"}

Die konvertierung eines Modells funktioniert sehr einfach, die konvertierung kann mit dem
Konsolenbefehl `tensorflowjs_wizard` gestartet werden. Im folgenden Dialog kommen eine Vielzahl von Einstellungen die
vorgenommen werden müssen:
![](../assets/images/konv.png){: style="width:100%"}

Die Einstellungen wie oben angegeben wurden für alle unsere Tensorflow-JS Models verwendet. Es gibt zudem bereits hier
Komprimierungsmöglichkeiten. Den größten Performance Boost hatten wir mit der float16 quantization festgestellt.
![](../assets/images/small.png){: style="width:100%"}

Der Output dieser Konvertierung (`model.json`, `group1-shard*of*.bin`) kann dann mit TensorflowJs geladen und verwendet
werden (siehe [Vorhersage](#vorhersage)).

## Installation

Um TensorflowJs in React Native zu Verwenden, müssen einige Packages installiert werden. Eine Anleitung der benötigten
Schritte befindet sich [hier](https://www.npmjs.com/package/@tensorflow/tfjs-react-native#expo-compatibility).

!!! tip In der Dokumentation von TensorflowJs für React Native steht zwar, dass einige Funktionen wie zum
Beispiel [bundleResourceIO](https://js.tensorflow.org/api_react_native/latest/#bundleResourceIO) nicht
mit [Expo](https://expo.io/) funktionieren, diese konnten wir allerdings ohne Probleme Verwenden.

!!! warning Damit [Schritt 3](https://www.npmjs.com/package/@tensorflow/tfjs-react-native#step-3-configure-metro) der
Anleitung funktioniert kann es sein, dass noch das
Package [`@expo/metro-config`](https://www.npmjs.com/package/@expo/metro-config) installiert werden muss.

## Vorhersage

Um Tensorflow Js in React Native verwenden zu können muss dieses erst initialisiert werden. Dies sollte beim Anzeigen
einer Komponente passieren, welche Tensorflow Js verwendet.

```ts
import * as tf from "@tensorflow/tfjs";
import React, {useEffect, useState} from "react";

export const Camera = () => {
    const [isTfReady, setIsTfReady] = useState(false);

    useEffect(() => {
        const initTf = async () => {
            // Wait for tf to be ready.
            await tf.ready();

            // Signal to the app that tensorflow.js can now be used.
            setIsTfReady(true);
        };

//...
```

!!! warning Hierbei ist es wichtig das erst das Tensorflow Object (`tf`) verwendet wird, nachdem `tf.ready();`
erfolgreich ausgeführt wurde. Hierfür wurde der State `isTfReady`
gesetzt, um die Komponenten erst nach dem Initialisieren anzuzeigen.

Nachdem Tensorflow initalisiert wurde, kann das Vorher exportierte Modell geladen werden. Hierfür werden die Tensorflow
funktionen `loadGraphModel` und `bundleResourceIO` verwendet.

```ts
// model.json
const jsonModel = require("../../assets/v5-detector_3/model.json");
// weights
const weights = [
    require("../../assets/v5-detector_3/group1-shard1of2.bin"),
    require("../../assets/v5-detector_3/group1-shard2of2.bin"),
];

const model = await tf.loadGraphModel(bundleResourceIO(jsonModel, weights));
```

!!! tip um das Model später zu verwenden, sollte dieses in einem State gespeichert werden.

Nach dem Erfolgreichen laden des Modells kann dieses nun Verwendet werden. Hierfür stellt Tensorflow die
Funktion `executeAsync`[^2] bereit.

```ts
import * as tf from "@tensorflow/tfjs";

export const predict = async (
    model: tf.GraphModel | undefined,
    nextImageTensor: any
): Promise<PredictionResult[]> => {
    if (!model) return [];

    // Vorhersage machen
    const res = ((await model?.executeAsync(
        nextImageTensor?.expandDims(0)
    )) as any) as tf.Tensor[];

    //...
};
```

Das Resultat, welches man von der `executeAsync` function bekommt, kann je nach Modell variieren, bei uns war es ein
Array von Tensoren die verschiedene Informationen enthalten. Für die Umsetzung dieser App wurden allerdings nur Zwei
Teile des Arrays benötigt:
`class` und `Scores`.

```ts
import {getLabels, PredictionResult} from "./label";
import * as tf from "@tensorflow/tfjs";

export const predict = async (
    model: tf.GraphModel | undefined,
    nextImageTensor: any
): Promise<PredictionResult[]> => {
    // ...

    const classes = res[1].dataSync() as Float32Array;
    const scores = res[5].dataSync() as Float32Array;

    return getLabels(classes, scores);
};
```

Um aus einem Tensor die Daten zu bekommen, kann man die Function `dataSync()` verwendet, welche ein Array mit den Werten
des Tensors zurückgibt.

!!! tip Da auch die Postion der Tensoren im Array von Model zu Model unterschiedlich sind[^3], haben wir mithilfe des
Folgenden Codeblocks, die längen der Arrays ausgegeben und dadurch die benötigten Teile des Arrays gefunden (Da unser
Modell 6 Klassifikationen Pro Bild macht enthalten die Arrays der länge 6 die "wichtigen" Information).

    ```ts
      res.forEach(r => console.log(r.dataSync().length))
    ```

## Video

Die Klassifikation von Bildern aus einem Kamera Stream ist ganz einfach möglich, da Tensorflow Js hierfür ein
vorgefertigtes Komponent mitliefert. Ein Beispiel hierfür befindet
sich [hier](https://js.tensorflow.org/api_react_native/latest/#cameraWithTensors). Dort kann man dann in
der `handleCameraStream` funktion die in [Vorhersage](#vorhersage) beschriebenen Schritte mit dem `nextImageTensor`
ausführen.

!!! tip Bei dem Stylen der Kamera Komponenten (`cameraWithTensors`) müssen `width` und `height` gesetzt sein, da dieses
sonst nicht angezeigt wird.

## Probleme

Die Einrichtung und Verwendung von Tensorflow Js funktioniert zwar ohne Probleme, allerdings hatten wir mit unserem
Modell große Performance Probleme. Hierbei hat anfangs die Klassifikation eines Bildes `20 Sekunden` gedauert. Da dies
natürlich viel zu lang ist, haben wir geschaut, ob die Performance noch irgendwie optimiert werden kann. Hierbei sind
wir darauf gestoßen, dass man beim Konvertieren Optimierungsalgorithmen verwenden kann. Bei unserem Modell hat
der `float16 quantization` Optimierung am besten funktioniert[^3]. Mit dieser Optimierung konnten wir die Klassifikation
eines Bildes auf `14 Sekunden` verringern. Da dies allerdings auch noch nicht ausreicht, haben wir uns dafür entschieden
Tensorflow Js nicht zu verwenden und stattdessen auf eine Client-Serverarchitektur zu setzen.

[^1]: Quelle: https://blog.tensorflow.org/2020/02/tensorflowjs-for-react-native-is-here.html
[^2]: Tensorflow JS bietet auch noch weitere Möglichkeiten eine "Vorhersage" durchzuführen
[^3]: Die Verwendung hiervon wurde im Abschnitt [Konvertierung](#konvertierung) beschrieben