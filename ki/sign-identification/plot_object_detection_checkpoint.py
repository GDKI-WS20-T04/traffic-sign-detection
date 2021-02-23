import os

import matplotlib

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'    # Suppress TensorFlow logging (1)
import tensorflow as tf
import cv2
from object_detection.utils import label_map_util

tf.get_logger().setLevel('ERROR')           # Suppress TensorFlow logging (2)

gpus = tf.config.experimental.list_physical_devices('GPU')
for gpu in gpus:
    tf.config.experimental.set_memory_growth(gpu, True)


IMAGE_PATHS =[]
path = "E:/gdki-ws-20-21-projekt/ki/sign-identification/images/eval"

files = os.listdir(path)

for idx, file in enumerate(files):
    IMAGE_PATHS.append(path + "/" + file)


PATH_TO_MODEL_DIR = 'E:/gdki-ws-20-21-projekt/ki/sign-identification/exported-models/version_6'

PATH_TO_CFG = PATH_TO_MODEL_DIR + "/pipeline.config"
PATH_TO_CKPT = PATH_TO_MODEL_DIR + "/saved_model"
PATH_TO_LABELS = 'E:/gdki-ws-20-21-projekt/ki/sign-identification/annotations/label_map.pbtxt'


import time
from object_detection.utils import label_map_util
from object_detection.utils import config_util
from object_detection.utils import visualization_utils as viz_utils
from object_detection.builders import model_builder


print('Loading model... ', end='')
start_time = time.time()

# Load pipeline config and build a detection model
configs = config_util.get_configs_from_pipeline_file(PATH_TO_CFG)
model_config = configs['model']

detect_fn = tf.saved_model.load(PATH_TO_CKPT)



category_index = label_map_util.create_category_index_from_labelmap(PATH_TO_LABELS,
                                                                    use_display_name=True)




end_time = time.time()
elapsed_time = end_time - start_time
print('Done! Took {} seconds'.format(elapsed_time))


import numpy as np
from PIL import Image
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings('ignore')   # Suppress Matplotlib warnings

def load_image_into_numpy_array(path):
    return np.array(Image.open(path))

i = 0
for image_path in IMAGE_PATHS:

    print('Running inference for {}... '.format(image_path), end='')

    image_np = load_image_into_numpy_array(image_path)
    if image_np.shape[2] == 4:
        image_np = image_np[:, :, :3]

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
            max_boxes_to_draw=200,
            min_score_thresh=.30,
            agnostic_mode=False,
    )
    plt.figure()
    plt.imshow(image_np_with_detections)
    plt.savefig("new_img"+str(i)+".jpg", transparent=True)
    i = i + 1
    print('Done')

plt.show()
