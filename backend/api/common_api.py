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
    profiles = get_user_account(id=request.view_args['user_id'])
    return jsonify(response=profiles)


@common_api.route("/CreateUser", methods=['POST'])
def create_user():
    app.logger.info("[api-CreateUser]")
    user_params = request.json
    user_params['first_name'] = user_params['first_name']
    user_params['last_name'] = user_params['last_name']
    user_params['email'] = user_params['email']
    user_params['password'] = user_params['password']
    user_params['date_of_birth'] = datetime.datetime.utcnow() # user_params['date_of_birth'] TODO: Send dob as a timestamp from frontend
    user_params['ssn'] = user_params['ssn']
    user_params['address1'] = user_params['address1']
    user_params['address2'] = user_params['address2']
    user_params['contact'] = user_params['contact']
    user_params['role_id'] = 1 # TODO change it after constants are added to the branch
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
