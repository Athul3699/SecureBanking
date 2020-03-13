from flask import Blueprint, jsonify, request
from securebankingsystem.backend.services.common import *
from securebankingsystem import backend
common_api = Blueprint('common_api', __name__)


@common_api.route("/CustomerAccounts/<user_id>", methods = ['GET'])
def customer_accounts(user_id):
    backend.logger.info("[api-CustomerAccounts]")
    accounts = get_customer_accounts(request.view_args['user_id'])
    return jsonify(response=accounts)


@common_api.route("/Profile/<user_id>", methods = ['GET'])
def profile(user_id):
    backend.logger.info("[api-Profile]")
    profiles = get_profile_information(request.view_args['user_id'])
    return jsonify(response=profiles)


