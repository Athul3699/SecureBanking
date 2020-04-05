from flask import Blueprint, jsonify, request
from backend import app
from backend.services.common import *
from datetime import datetime
from dateutil.parser import parse
from backend.services.security_util import *
from backend.services.authenticate import authenticate

common_api = Blueprint('common_api', __name__)


@common_api.route("/CustomerAccounts/<user_id>", methods=['GET'])
def customer_accounts(user_id):
    app.logger.info("[api-CustomerAccounts]")
    accounts = get_customer_bank_accounts(user_id=request.view_args['user_id'])
    return jsonify(response=accounts)


@common_api.route("/UpdateUser", methods=['POST'])
def update_user_account_api_profile():
    app.logger.info("[api-Profile]")
    data = request.json

    profile = update_user_account_email_service(email=data['email'])
    return jsonify(response=profile)

@authenticate
@common_api.route("/GetUser", methods=['POST'])
def get_user_account_endpoint():
    app.logger.info("[api-get-user]")
    args = request.json
    headers = request.headers

    token = headers['token']
    email = decode_email(token)

    # email = decode_email(args['token'])
    # del args['token']
    # email = 'a@a.com'
    response = get_user_account(email=email)
    return jsonify( { "status": "success", "data": { "data": response }})


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
