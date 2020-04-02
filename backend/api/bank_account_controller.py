from flask import jsonify, g, Blueprint, request
from backend import app
from ..services.common import get_customer_bank_accounts, add_customer_bank_account, generate_account_number, update_customer_bank_account, get_user_account
from ..services.constants import *
from ..services.security_util import decode_email
import datetime
from ..services.authenticate import authenticate

bank_account_api = Blueprint('bank_account_api', __name__)


"""
GET:
    request = id
    response = User(id=id)
POST:
    request = User
    response = User
DELETE:
    request = id
    response = User
"""
@bank_account_api.route("/BankAccount", methods=['GET', 'POST', 'PUT', 'DELETE'])
def employee_account_actions():
    app.logger.info("[api-bank-account-actions]")
    args = request.json

    email = decode_email(args['token'])
    user_id = get_user_account(email=email)

    if user_id == None:
        return jsonify(response={ "status": "failure", "errorMessage": "user does not exist"})

    response = {}
    if (request.method == 'GET'):
        response = get_customer_bank_accounts(**args)
    elif (request.method == 'POST'):
        args['user_id'] = user_id
        response = add_customer_bank_account(**args)
    elif (request.method == 'PUT'):
        response = update_customer_bank_account(**args)
    else:
        response = update_customer_bank_account(account_number=args['account_number'], is_active=False)
        
    return jsonify(response=response)
    


@bank_account_api.route("/GetCustomerAccounts", methods=['GET'])
def get_all_customer_accounts():
    app.logger.info("[GetCustomerAccounts]")
    args = request.json

    email = decode_email(args['token'])
    user_id = get_user_account(email=email)

    if user_id == None:
        return jsonify(response={ "status": "failure", "errorMessage": "user does not exist"})

    accounts = get_customer_bank_accounts(user_id=user_id)
    
    return jsonify(response={ "status": "success", data:accounts})


@authenticate
@bank_account_api.route("/CreateBankAccount", methods=['POST'])
def create_bank_account():
    app.logger.info("[CreateBankAccount]")
    args = request.json
    token = request.headers['token']

    email = decode_email(token)
    user = get_user_account(email=email)


    if user == None:
        return jsonify(response={ "status": "failure", "errorMessage": "user does not exist"})

    number = generate_account_number()
    account_type = args['type']
    user_id = user['id']
    balance = (float)(args['balance'])
    routing_number = '1234567' 

    result = add_customer_bank_account(number=number, type=account_type, balance=balance, user_id=user_id, routing_number=routing_number)
    if result=='success':
        return jsonify(response={ "status": "success"})
    else:
        return jsonify(response={ "status": "failure", "errorMessage": "error creating bank account"})