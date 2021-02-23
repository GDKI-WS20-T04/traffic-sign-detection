import numpy as np
import tensorflow as tf
import cv2
import pathlib

# Load TFLite model and allocate tensors.
interpreter = tf.lite.Interpreter(model_path="model.tflite")

# Get input and output tensors.
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

interpreter.allocate_tensors()

# input details
print(input_details)
# output details
print(output_details)

for file in pathlib.Path("E:/gdki-ws-20-21-projekt/ki/sign-identification/images/eval").iterdir():
    # read and resize the image
    img = cv2.imread(r"{}".format(file.resolve()))
    new_img = cv2.resize(img, (640, 640))

    print(new_img.shape)
    # input_details[0]['index'] = the index which accepts the input
    interpreter.set_tensor(input_details[0]['index'], [new_img])

    # run the inference
    interpreter.invoke()

    # output_details[0]['index'] = the index which provides the input
    output_data = interpreter.get_tensor(output_details[0]['index'])

    print("For file {}, the output is {}".format(file.stem, output_data))
