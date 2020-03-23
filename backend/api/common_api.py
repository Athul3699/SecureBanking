from flask import Blueprint, jsonify, request
from backend import app
from backend.services.common import *
import datetime
common_api = Blueprint('common_api', __name__)


@common_api.route("/CustomerAccounts/<user_id>", methods=['GET'])
def customer_accounts(user_id):
    app.logger.info("[api-CustomerAccounts]")
    accounts = get_customer_bank_accounts(user_id=request.view_args['user_id'])
    return jsonify(response=accounts)


@common_api.route("/User/<user_id>", methods=['GET'])
def profile(user_id):
    app.logger.info("[api-Profile]")
    profile = get_user_account(id=request.view_args['user_id'])
    return jsonify(response=profile)


@common_api.route("/CreateUser", methods=['POST'])
def create_user():
    app.logger.info("[api-CreateUser]")
    user_params = request.json
    user_params['date_of_birth'] = datetime.datetime.fromtimestamp(user_params['date_of_birth'] / 1e3)
    if ('role_id' not in user_params) or (user_params['role_id'] == None):
        user_params['role_id'] =  INDIVIDUAL
    message = add_user_account(**user_params)
    return jsonify(response=message)

""" reference for getting json body args """
@common_api.route("/testparams", methods=['POST'])
def test_params():
    app.logger.info("[api-CreateUser]")
    user_params = request.json
    print(user_params)
    return jsonify({'message': user_params['first_name']})


@common_api.route("/CreateRoles", methods=['GET'])
def create_roles():
    message = add_roles()
    return jsonify(response=message)
