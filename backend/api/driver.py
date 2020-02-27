from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

import datetime
import logging
import os

DOWNLOAD_FOLDER = "../logs/"
UPLOAD_FOLDER = "../data/"

LOG_FILE = "logger" + str(datetime.datetime.now()) + ".log"

app = Flask(__name__)
cors = CORS(app)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["DOWNLOAD_FOLDER"] = DOWNLOAD_FOLDER
file_handler = logging.FileHandler(DOWNLOAD_FOLDER + "logger.log")
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logger.addHandler(file_handler)

@app.route("/")
def home():
    app.logger.info("[api-home]")
    return "Home"


@app.route("/api/v1/testapi")
def test_api():
    app.logger.info("[api-v1-testapi]")
    return "API Running Successfully!"


if __name__ == "__main__":
    app.run(debug=True)
