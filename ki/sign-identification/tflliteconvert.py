import tensorflow as tf

converter = tf.lite.TFLiteConverter.from_saved_model(
    "E:/gdki-ws-20-21-projekt/ki/sign-identification/exported-models/version_6_test/saved_model")  # path to the SavedModel directory

converter.target_spec.supported_ops = [
    tf.lite.OpsSet.TFLITE_BUILTINS,  # enable TensorFlow Lite ops.
    tf.lite.OpsSet.SELECT_TF_OPS  # enable TensorFlow ops.
]
converter.inference_input_type = tf.float32
converter.inference_output_type = tf.float32
tflite_model = converter.convert()

# Save the model.
with open('model.tflite', 'wb') as f:
    f.write(tflite_model)
