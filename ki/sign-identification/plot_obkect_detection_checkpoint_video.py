"""
Sections of this code were taken from:
https://github.com/tensorflow/models/blob/master/research/object_detection/object_detection_tutorial.ipynb
"""

import os

import matplotlib

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'    # Suppress TensorFlow logging (1)
import tensorflow as tf
import cv2

tf.get_logger().setLevel('ERROR')           # Suppress TensorFlow logging (2)

gpus = tf.config.experimental.list_physical_devices('GPU')
for gpu in gpus:
    tf.config.experimental.set_memory_growth(gpu, True)


PATH_TO_MODEL_DIR = 'E:/gdki-ws-20-21-projekt/ki/sign-identification/exported-models/version_6'

PATH_TO_LABELS = 'E:/gdki-ws-20-21-projekt/ki/sign-identification/annotations/label_map.pbtxt'

import time
from object_detection.utils import label_map_util
from object_detection.utils import config_util
from object_detection.utils import visualization_utils as viz_utils
from object_detection.builders import model_builder

PATH_TO_CFG = PATH_TO_MODEL_DIR + "/pipeline.config"
PATH_TO_CKPT = PATH_TO_MODEL_DIR + "/saved_model"

print('Starting... ', end='')
start_time = time.time()

# Load pipeline config and build a detection model
configs = config_util.get_configs_from_pipeline_file(PATH_TO_CFG)
model_config = configs['model']
detect_fn = tf.saved_model.load(PATH_TO_CKPT)




category_index = label_map_util.create_category_index_from_labelmap(PATH_TO_LABELS,
                                                                    use_display_name=True)


import numpy as np
from PIL import Image
import warnings
import datetime
warnings.filterwarnings('ignore')   # Suppress Matplotlib warnings

def load_image_into_numpy_array(path):
    return np.array(Image.open(path))

i = 0

out = cv2.VideoWriter("testing/output" + str(time.time())+ ".avi",
cv2.VideoWriter_fourcc(*"MJPG"), 10,(1920,1080))

cap = cv2.VideoCapture('testing/4.mp4')

while(cap.isOpened()):

    ret, frame = cap.read()

    # Recolor the frame. By default, OpenCV uses BGR color space.
    # This short blog post explains this better:
    # https://www.learnopencv.com/why-does-opencv-use-bgr-color-format/
    try:
        image_np = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    except :
        break

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

    label_id_offset = 0
    image_np_with_detections = image_np.copy()

    matplotlib.rcParams.update({'font.size': 22})
    viz_utils.visualize_boxes_and_labels_on_image_array(
            image_np_with_detections,
            detections['detection_boxes'],
            detections['detection_classes']+label_id_offset,
            detections['detection_scores'],
            category_index,
            use_normalized_coordinates=True,
            line_thickness=8,
            min_score_thresh=.05,
            agnostic_mode=False,
    )
    output_rgb = cv2.cvtColor(image_np_with_detections, cv2.COLOR_RGB2BGR)
    cv2.imshow('frame', output_rgb)
    out.write(output_rgb)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break


out and out.release()
cap.release()
cv2.destroyAllWindows()


end_time = time.time()
elapsed_time = end_time - start_time
print('Done! Took {} seconds'.format(elapsed_time))