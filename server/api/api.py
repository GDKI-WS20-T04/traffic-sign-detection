import io
import json
import time
import matplotlib
import matplotlib.pyplot as plt
import cv2
import flask
import logging

import numpy as np
from PIL import Image
from flask import (Blueprint, request)
import tensorflow as tf
import base64
from object_detection.utils import visualization_utils as viz_utils
from object_detection.utils import label_map_util

tf.get_logger().setLevel('ERROR')

gpus = tf.config.experimental.list_physical_devices('GPU')
for gpu in gpus:
    tf.config.experimental.set_memory_growth(gpu, True)

logger = logging.getLogger()

api = Blueprint('api', __name__)
PATH_TO_MODEL_DIR = 'E:/gdki-ws-20-21-projekt/ki/sign-identification/exported-models/version_4_50kbetterMobile'
PATH_TO_CKPT = PATH_TO_MODEL_DIR + "/saved_model"
PATH_TO_LABELS = 'E:/gdki-ws-20-21-projekt/ki/sign-identification/annotations/label_map.pbtxt'

detect_fn = tf.saved_model.load(PATH_TO_CKPT)

category_index = label_map_util.create_category_index_from_labelmap(PATH_TO_LABELS,
                                                                    use_display_name=True)

app = flask.Flask(__name__, static_url_path="/")
i = 250


@app.route("/image", methods=["POST"])
def test_image():
    global i
    start_time = time.time()
    try:
        if "base64_image" in request.values:
            base64_decoded = base64.b64decode(request.values['base64_image'])
            image = Image.open(io.BytesIO(base64_decoded))
            npimg = np.array(image)
        else:
            if "image" not in request.files:
                err = flask.jsonify({"err_msg": "Missing Image"})
                return err, 400

            image = request.files['image']
            npimg = np.array(Image.open(image))

        if npimg.shape[2] == 4:
            npimg = npimg[:, :, :3]

        input_tensor = tf.convert_to_tensor(npimg)

        input_tensor = input_tensor[tf.newaxis, ...]

        detections = detect_fn(input_tensor)
        num_detections = int(detections.pop('num_detections'))
        detections = {key: value[0, :num_detections].numpy()
                      for key, value in detections.items()}
        boxes = []
        for box in detections["detection_boxes"]:
            boxes.append(list(map(float, box)))

        result = {
            "detection_classes": list(map(int, detections["detection_classes"])),
            "detection_scores": list(map(float, detections["detection_scores"])),
            "detection_boxes": boxes
        }

        """
        detections['detection_classes'] = detections['detection_classes'].astype(np.int64)
        if detections['detection_scores'][0] >= 0.7:
            image_np_with_detections = npimg.copy()

            matplotlib.rcParams.update({'font.size': 22})
            viz_utils.visualize_boxes_and_labels_on_image_array(
                image_np_with_detections,
                detections['detection_boxes'],
                detections['detection_classes'],
                detections['detection_scores'],
                category_index,
                use_normalized_coordinates=True,
                max_boxes_to_draw=200,
                min_score_thresh=.70,
                agnostic_mode=False,
            )
            plt.figure()
            plt.imshow(image_np_with_detections)
            plt.savefig("new_img" + str(i) + ".jpg", transparent=True)
            i = i + 1
        """

        end(start_time)

        return flask.jsonify(result)
    except Exception:
        logger.exception("An error occurred: ")
        end(start_time)
        err = flask.jsonify({"err_msg": "An error occurred"})
        return err, 500


def end(start_time):
    elapsed_time = time.time() - start_time
    print('Done! Took {} seconds'.format(elapsed_time))


app.run(host="0.0.0.0", threaded=True, port=5025)
