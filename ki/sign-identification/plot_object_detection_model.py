import os
import matplotlib
import tensorflow as tf
import numpy as np
from PIL import Image
import matplotlib.pyplot as plt
import warnings
import time
from object_detection.utils import label_map_util
from object_detection.utils import visualization_utils as viz_utils

warnings.filterwarnings('ignore')  # Suppress Matplotlib warnings

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Suppress TensorFlow logging (1)
tf.get_logger().setLevel('ERROR')  # Suppress TensorFlow logging (2)

gpus = tf.config.experimental.list_physical_devices('GPU')
for gpu in gpus:
    tf.config.experimental.set_memory_growth(gpu, True)

IMAGE_PATHS = []
path = "E:/gdki-ws-20-21-projekt/ki/sign-identification/images/eval"

files = os.listdir(path)

for idx, file in enumerate(files):
    IMAGE_PATHS.append(path + "/" + file)

PATH_TO_MODEL_DIR = 'E:/gdki-ws-20-21-projekt/ki/sign-identification/exported-models/version_4_50kbetterMobile'
PATH_TO_MODEL = PATH_TO_MODEL_DIR + "/saved_model"
PATH_TO_LABELS = 'E:/gdki-ws-20-21-projekt/ki/sign-identification/annotations/label_map.pbtxt'

print('Loading model... ', end='')
start_time = time.time()

detect_fn = tf.saved_model.load(PATH_TO_MODEL)

category_index = label_map_util.create_category_index_from_labelmap(PATH_TO_LABELS,
                                                                    use_display_name=True)


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

    num_detections = int(detections.pop('num_detections'))
    detections = {key: value[0, :num_detections].numpy()
                  for key, value in detections.items()}
    detections['num_detections'] = num_detections

    detections['detection_classes'] = detections['detection_classes'].astype(np.int64)

    label_id_offset = 0
    image_np_with_detections = image_np.copy()

    matplotlib.rcParams.update({'font.size': 22})
    viz_utils.visualize_boxes_and_labels_on_image_array(
        image_np_with_detections,
        detections['detection_boxes'],
        detections['detection_classes'] + label_id_offset,
        detections['detection_scores'],
        category_index,
        use_normalized_coordinates=True,
        max_boxes_to_draw=200,
        min_score_thresh=.30,
        agnostic_mode=False,
    )
    plt.figure()
    plt.imshow(image_np_with_detections)
    plt.savefig("new_img" + str(i) + ".jpg", transparent=True)
    i = i + 1
    print('Done')

end_time = time.time()
elapsed_time = end_time - start_time
print('Done! Took {} seconds'.format(elapsed_time))
