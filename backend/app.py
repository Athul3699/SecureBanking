from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from backend.api.common_api import common_api
from backend.api.driver import driver_api
from backend.api.auth_controller import auth_api
from backend.api.user_controller import user_api
from backend.api.admin_controller import admin_api
from backend.api.appointment_controller import appointment_api
from backend.api.transaction_api import transaction_api
from backend.api.bank_account_controller import bank_account_api
import datetime
import logging

DOWNLOAD_FOLDER = "./logs/"
UPLOAD_FOLDER = "./data/"

COMMON_PREFIX = "/api/v1"

LOG_FILE = "logger" + str(datetime.datetime.now()) + ".log"

file_handler = logging.FileHandler(DOWNLOAD_FOLDER + "logger.log")
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logger.addHandler(file_handler)
app = Flask(__name__)
CORS(app)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["DOWNLOAD_FOLDER"] = DOWNLOAD_FOLDER
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///securebank'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
#Secret key for token authentication
app.config['SECRET_KEY'] = '$$group10'

logging.getLogger('flask_cors').level = logging.DEBUG

db = SQLAlchemy(app)

app.register_blueprint(common_api, url_prefix=COMMON_PREFIX + '/common')
app.register_blueprint(driver_api)
app.register_blueprint(auth_api, url_prefix=COMMON_PREFIX + '/auth')
app.register_blueprint(user_api, url_prefix=COMMON_PREFIX + '/user')
app.register_blueprint(admin_api, url_prefix=COMMON_PREFIX + '/admin')
app.register_blueprint(appointment_api, url_prefix=COMMON_PREFIX + '/appointment')
app.register_blueprint(transaction_api, url_prefix=COMMON_PREFIX+'/transaction')
app.register_blueprint(bank_account_api, url_prefix=COMMON_PREFIX+'/bank_account')


if __name__ == "__main__":
    db.init_app(app)
    app.run(debug=True)
