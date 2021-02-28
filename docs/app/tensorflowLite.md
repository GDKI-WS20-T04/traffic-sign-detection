# Tensorflow Lite

Um die Klassifikation der Schilder noch weiter zu beschleunigen haben wir uns auch
noch [Tensorflow lite](https://www.tensorflow.org/lite) angeschaut. React Native hat jedoch keine offizielle TensorFlow
Unterstützung. Alle verfügbaren Packages sind veraltet [^1]. Des Weiteren funktionieren diese Packages auch nicht mit
Expo, was dazu führt, dass man das Projekt `ejecten` muss. Daher müssen einige Packages installiert und angepasst werden,
was wiederum zu verschiedensten Problemen führt. Dadurch haben wir es nicht in der Zeit geschafft `Tflite` mit React
Native zu verwenden.

!!! note 
        eine nicht vollständige Version der App mit `Tflite` befindet sich im
        Branch [`9-tensorflow-lite`](https://github.com/GDKI-WS20-T04/traffic-sign-detection/tree/9-tensorflow-lite).

[^1]: wie z.B.: https://www.npmjs.com/package/tflite-react-native
, https://www.npmjs.com/package/react-native-tflite-camera