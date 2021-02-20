import time

import cv2
import flask
import logging

import numpy as np
from flask import (Blueprint, request)
import tensorflow as tf


logger = logging.getLogger()

api = Blueprint('api', __name__)
PATH_TO_MODEL_DIR = 'E:/gdki-ws-20-21-projekt/ki/sign-identification/exported-models/version_5'
PATH_TO_CKPT = PATH_TO_MODEL_DIR + "/saved_model"

detect_fn = tf.saved_model.load(PATH_TO_CKPT)

app = flask.Flask(__name__, static_url_path="/")

@app.route("/image", methods=["POST"])
def test_image():
    start_time = time.time()
    try:
        if "image" not in request.files:
            err = flask.jsonify({"err_msg": "Missing Image"})
            return err, 400

        image = request.files['image']
        npimg = np.fromfile(image, np.uint8)
        file = cv2.imdecode(npimg, cv2.COLOR_BGR2RGB)

        input_tensor = tf.convert_to_tensor(file)

        input_tensor = input_tensor[tf.newaxis, ...]

        detections = detect_fn(input_tensor)
        num_detections = int(detections.pop('num_detections'))
        detections = {key: value[0, :num_detections].numpy()
                      for key, value in detections.items()}

        result = {
            "detection_classes": list(map(int, detections["detection_classes"])),
            "detection_scores": list(map(float, detections["detection_scores"]))
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

app.run(host = "0.0.0.0")