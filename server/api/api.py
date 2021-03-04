import io
import time
import flask
import logging
import os

import numpy as np
from PIL import Image
from flask import (Blueprint, request)
import tensorflow as tf
import base64

tf.get_logger().setLevel('ERROR')

gpus = tf.config.experimental.list_physical_devices('GPU')
for gpu in gpus:
    tf.config.experimental.set_memory_growth(gpu, True)

logger = logging.getLogger()

api = Blueprint('api', __name__)
PATH_TO_MODEL_DIR = os.path.normpath(os.path.join(os.path.dirname(__file__), '../..', 'ki/sign-identification/exported-models/version_4_50kbetterMobile'))
PATH_TO_CKPT = PATH_TO_MODEL_DIR + "/saved_model"
PATH_TO_LABELS = os.path.normpath(os.path.join(os.path.dirname(__file__), '../..', 'ki/sign-identification/annotations/label_map.pbtxt'))

detect_fn = tf.saved_model.load(PATH_TO_CKPT)


app = flask.Flask(__name__, static_url_path="/")


@app.route("/image", methods=["POST"])
def test_image():
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
