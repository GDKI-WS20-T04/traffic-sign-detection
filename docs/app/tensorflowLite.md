# Tensorflow Lite

Um die Klassification der Schilder noch weiter zu Beschleunigen haben wir uns auch noch [Tensorflow lite](https://www.tensorflow.org/lite) angeschaut.
Da dies allerdings keine Officelle unterstützung bietet und alle Verfügaren Packages veraltet sind[^1]. Desweiteren funktionieren diese Packages auch nicht mit Expo, was 
dazu führt das man das Projekt `ejecten` muss. Daher muss man einige Sachen installiern und Anpassen was wiederrun zu verschidenesten Problemen führt. Sommit haben wir in 
der Zeit nicht geschaft `Tflite` mit React Native zu verwenden.

!!! note
    Eine nicht Vollständige version der App mit `Tflite` befindet sich im Branch [`9-tensorflow-lite`](https://github.com/GDKI-WS20-T04/traffic-sign-detection/tree/9-tensorflow-lite). 

[^1]: wie z.B.: https://www.npmjs.com/package/tflite-react-native, https://www.npmjs.com/package/react-native-tflite-camera