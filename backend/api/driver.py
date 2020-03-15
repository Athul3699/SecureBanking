# from securebankingsystem import backend
from flask import Blueprint
from backend import app

driver_api = Blueprint('driver_api', __name__)


@driver_api.route("/")
def home():
    app.logger.info("[api-home]")
    return "Home"

@driver_api.route("/api/v1/testapi")
def test_api():
    app.logger.info("[api-v1-testapi]")
    return "API Running Successfully!"

