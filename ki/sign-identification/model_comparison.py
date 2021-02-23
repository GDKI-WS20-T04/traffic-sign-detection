import os

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Suppress TensorFlow logging (1)
import tensorflow as tf
import time
from object_detection.utils import label_map_util
from object_detection.utils import config_util
from object_detection.builders import model_builder

import numpy as np
from PIL import Image

tf.get_logger().setLevel('ERROR')  # Suppress TensorFlow logging (2)
gpus = tf.config.experimental.list_physical_devices('GPU')
for gpu in gpus:
    tf.config.experimental.set_memory_growth(gpu, True)

IMAGE_PATHS = []
path = "E:/gdki-ws-20-21-projekt/ki/sign-identification/images/eval"
PATH_TO_MODEL_DIR = 'E:/gdki-ws-20-21-projekt/ki/sign-identification/exported-models/version_4_50kbetterMobile'
PATH_TO_LABELS = 'E:/gdki-ws-20-21-projekt/ki/sign-identification/annotations/label_map.pbtxt'
PATH_TO_CFG = PATH_TO_MODEL_DIR + "/pipeline.config"
PATH_TO_CKPT = PATH_TO_MODEL_DIR + "/checkpoint"

files = os.listdir(path)

for idx, file in enumerate(files):
    IMAGE_PATHS.append(path + "/" + file)

print('Loading model... ', end='')
start_time = time.time()

configs = config_util.get_configs_from_pipeline_file(PATH_TO_CFG)
model_config = configs['model']
detection_model = model_builder.build(model_config=model_config, is_training=False)

ckpt = tf.compat.v2.train.Checkpoint(model=detection_model)
ckpt.restore(os.path.join(PATH_TO_CKPT, 'ckpt-0')).expect_partial()


@tf.function
def detect_fn(image):
    """Detect objects in image."""

    image, shapes = detection_model.preprocess(image)
    prediction_dict = detection_model.predict(image, shapes)
    detections = detection_model.postprocess(prediction_dict, shapes)

    return detections


def load_image_into_numpy_array(path):
    return np.array(Image.open(path))


category_index = label_map_util.create_category_index_from_labelmap(PATH_TO_LABELS,
                                                                    use_display_name=True)

i = 0
score1 = 0
score2 = 0
true_values = [25, 1, 33, 24, 25, 31, 31, 25, 24, 23, 26, 31, 23, 26, 3, 3, 4, 4, 3, 25, 22, 25, 1, 26, 31]
wrong_pictures = ""
wrong_detection = []
for idx, image_path in enumerate(IMAGE_PATHS):

    image_np = load_image_into_numpy_array(image_path)
    if image_np.shape[2] == 4:
        image_np = image_np[:, :, :3]

    input_tensor = tf.convert_to_tensor(np.expand_dims(image_np, 0), dtype=tf.float32)

    detections = detect_fn(input_tensor)

    num_detections = int(detections.pop('num_detections'))
    detections = {key: value[0, :num_detections].numpy()
                  for key, value in detections.items()}
    detections['num_detections'] = num_detections

    detections['detection_classes'] = detections['detection_classes'].astype(np.int64)
    if detections['detection_classes'][0] == true_values[idx]:
        score1 += 1
        score2 += detections['detection_scores'][0]
    else:
        wrong_pictures += image_path
        wrong_detection.append(detections['detection_classes'])
        wrong_detection.append(detections['detection_scores'])

print("Von " + str(len(true_values)) + " Bildern wurden " + str(score1) + " korrekt erkannt")
print("Gesamtscore: " + str(score2))

end_time = time.time()
elapsed_time = end_time - start_time
print('Done! Took {} seconds'.format(elapsed_time))
