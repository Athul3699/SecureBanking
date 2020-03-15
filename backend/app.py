from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from backend.api.common_api import common_api
from backend.api.driver import driver_api
from backend.api.auth_controller import auth_api
import datetime
import logging

DOWNLOAD_FOLDER = "./logs/"
UPLOAD_FOLDER = "./data/"

LOG_FILE = "logger" + str(datetime.datetime.now()) + ".log"

file_handler = logging.FileHandler(DOWNLOAD_FOLDER + "logger.log")
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logger.addHandler(file_handler)
app = Flask(__name__)
cors = CORS(app)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["DOWNLOAD_FOLDER"] = DOWNLOAD_FOLDER
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///securebank'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
#Secret key for token authentication
app.config['SECRET_KEY'] = '$$group10'

db = SQLAlchemy(app)

app.register_blueprint(common_api, url_prefix='/api/v1/common')
app.register_blueprint(driver_api)
app.register_blueprint(auth_api, url_prefix='/api/v1/auth')

if __name__ == "__main__":
    db.init_app(app)
    app.run(debug=True)
