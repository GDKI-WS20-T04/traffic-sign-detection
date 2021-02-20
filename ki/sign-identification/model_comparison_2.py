import os

import matplotlib

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'    # Suppress TensorFlow logging (1)
import tensorflow as tf
import cv2

tf.get_logger().setLevel('ERROR')           # Suppress TensorFlow logging (2)

gpus = tf.config.experimental.list_physical_devices('GPU')
for gpu in gpus:
    tf.config.experimental.set_memory_growth(gpu, True)


IMAGE_PATHS =[]
path = "E:/gdki-ws-20-21-projekt/ki/sign-identification/images/eval"

files = os.listdir(path)

for idx, file in enumerate(files):
    IMAGE_PATHS.append(path + "/" + file)

print(IMAGE_PATHS)

PATH_TO_MODEL_DIR = 'E:/gdki-ws-20-21-projekt/ki/sign-identification/exported-models/version_5'

PATH_TO_LABELS = 'E:/gdki-ws-20-21-projekt/ki/sign-identification/annotations/label_map.pbtxt'

import time
from object_detection.utils import label_map_util
from object_detection.utils import config_util
from object_detection.builders import model_builder

PATH_TO_CFG = PATH_TO_MODEL_DIR + "/pipeline.config"
PATH_TO_CKPT = PATH_TO_MODEL_DIR + "/saved_model"

print('Loading model... ', end='')
start_time = time.time()

detect_fn = tf.saved_model.load(PATH_TO_CKPT)



import numpy as np
from PIL import Image

def load_image_into_numpy_array(path):
    return np.array(Image.open(path))

i = 0
score1 = 0
score2 = 0
true_values =[26,2,34,25,26,32,32,26,25,24,27,32,24,27,4,4,5,5,4,26,23,26,2,27,32]
wrong_pictures = ""
wrong_detection = []
for idx, image_path in enumerate(IMAGE_PATHS):

    image_np = load_image_into_numpy_array(image_path)
    if image_np.shape[2] == 4:
        image_np = image_np[:,:,:3]


    input_tensor = tf.convert_to_tensor(image_np)

    input_tensor = input_tensor[tf.newaxis, ...]

    detections = detect_fn(input_tensor)

    # All outputs are batches tensors.
    # Convert to numpy arrays, and take index [0] to remove the batch dimension.
    # We're only interested in the first num_detections.
    num_detections = int(detections.pop('num_detections'))
    detections = {key: value[0, :num_detections].numpy()
                  for key, value in detections.items()}
    detections['num_detections'] = num_detections

    # detection_classes should be ints.
    detections['detection_classes'] = detections['detection_classes'].astype(np.int64)
    if detections['detection_classes'][0]==true_values[idx]:
        score1 += 1
        score2 += detections['detection_scores'][0]
    else:
        wrong_pictures += image_path
        wrong_detection.append(detections['detection_classes'])
        wrong_detection.append(detections['detection_scores'])

print("Von "+ str(len(true_values)) + " Bildern wurden " +str(score1)+" korrekt erkannt")
print("Gesamtscore: " + str(score2))

end_time = time.time()
elapsed_time = end_time - start_time
print('Done! Took {} seconds'.format(elapsed_time))

# 12 / 25  7.19
# 18/ 25 15.74
# 19/25  16.4
# 1/25  0.005