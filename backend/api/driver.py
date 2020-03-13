from securebankingsystem import backend
from flask import Blueprint

driver_api = Blueprint('driver_api', __name__)


@driver_api.route("/")
def home():
    backend.app.logger.info("[api-home]")
    return "Home"

@driver_api.route("/api/v1/testapi")
def test_api():
    backend.app.logger.info("[api-v1-testapi]")
    return "API Running Successfully!"

