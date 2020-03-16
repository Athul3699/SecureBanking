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
    user_params = dict()
    user_params['first_name'] = request.form['first_name']
    user_params['last_name'] = request.form['last_name']
    user_params['email'] = request.form['email']
    user_params['password'] = request.form['password']
    user_params['date_of_birth'] = datetime.datetime.utcnow() # request.form['date_of_birth'] TODO: Send dob as a timestamp from frontend
    user_params['ssn'] = request.form['ssn']
    user_params['address1'] = request.form['address1']
    user_params['address2'] = request.form['address2']
    user_params['contact'] = request.form['contact']
    user_params['role_id'] = 1 # TODO change it after constants are added to the branch
    message = add_user_account(**user_params)
    return jsonify(response=message)


@common_api.route("/CreateRoles", methods=['GET'])
def create_roles():
    message = add_roles()
    return jsonify(response=message)