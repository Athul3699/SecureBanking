from flask import Blueprint, jsonify, request
from backend import app
from backend.services.common import *
from backend.services.transaction import *
import datetime
transaction_api = Blueprint('transaction_api', __name__)

@transaction_api.route("/Transactions/<transaction_id>", methods=['GET'])
def transactions(transaction_id):
    app.logger.info("[api-GET-Transactions]")
    transactions = get_transactions(id=request.view_args['transaction_id'])
    return jsonify(response=transactions)


@transaction_api.route("/AllTransactions", methods=['GET'])
def all_transactions():
    app.logger.info("[api-GET-All-Transactions]")
    transactions = get_transactions()
    return jsonify(response=transactions)


@transaction_api.route("/CriticalTransactions", methods=['GET'])
def get_critical_transactions():
    app.logger.info("[api-GET-All-CriticalTransactions]")
    transactions = get_transactions(is_critical=True)
    return jsonify(response=transactions)


@transaction_api.route("/NonCriticalTransactions", methods=['GET'])
def get_noncritical_transactions():
    app.logger.info("[api-GET-All-NonCriticalTransactions]")
    transactions = get_transactions(is_critical=False)
    return jsonify(response=transactions)


@transaction_api.route("/CreateTransaction", methods=['POST'])
def create_transaction():
    app.logger.info("[api-CreateTransaction]")
    trasaction_params = request.json
    trasaction_params["otp_needed"] = (bool)(trasaction_params["otp_needed"])
    trasaction_params["last_approved_time"] = datetime.datetime.utcnow()#fromtimestamp(trasaction_params['last_approved_time'] / 1e3)
    trasaction_params["otp_sent_time"] = datetime.datetime.utcnow()#fromtimestamp(trasaction_params['otp_sent_time'] / 1e3)
    trasaction_params["otp_valid_till"] = datetime.datetime.utcnow()#fromtimestamp(trasaction_params['otp_valid_till'] / 1e3)
    #perform checks on params and format them
    #trasaction_params["is_critical"] = isCritical((int)(trasaction_params["initiated_by"]), trasaction_params["amount"])
    message = add_transaction(**trasaction_params)
    return jsonify(response=message)


@transaction_api.route("/InitiateMoneyTransfer", methods=['POST'])
def initiate_money_transfer():
    app.logger.info("[api-InitiateMoneyTransfer]")
    trasaction_params = request.json
    trasaction_params["is_critical"] = isCritical(user_id, trasaction_params[amount])
    # get email or phone number or account number as parameter
    #perform checks on params and format them
    message = add_transaction(**trasaction_params)
    return jsonify(response=message)


@transaction_api.route("/InitiateDebit", methods=['POST'])
def initiate_debit():
    app.logger.info("[api-CreateUser]")
    trasaction_params = request.json
    # get email or phone number or account number as parameter
    #perform checks on params and format them
    message = add_transaction(**trasaction_params)
    return jsonify(response=message)


@transaction_api.route("/InitiateCredit", methods=['POST'])
def initiate_credit():
    app.logger.info("[api-InitiateCredit]")
    trasaction_params = request.json
    # get email or phone number or account number as parameter
    # perform checks on params and format them
    message = add_transaction(**trasaction_params)
    return jsonify(response=message)


#For customers
@transaction_api.route("/DeclineMoneyTransfer/<transaction_id>", methods=['POST'])
def decline_money_transfer(transaction_id):
    app.logger.info("[api-DeclineMoneyTransfer]")
    trasaction_params = request.json
    # get email or phone number or account number as parameter
    #perform checks on params and format them
    message = update_transaction(id = transaction_id, **trasaction_params)
    return jsonify(response=message)
    

#Replicate
#For Tier 1, Tier 2, Tier3
#For Merchants

#By Tier 1
@transaction_api.route("/ApproveMoneyTransferNonCritical/<transaction_id>", methods=['POST'])
def approve_money_transfer_noncritical(transaction_id):
    app.logger.info("[api-ApproveMoneyTransferNonCritical]")
    trasaction_params = request.json
    # get email or phone number or account number as parameter
    #perform checks on params and format them
    message = update_transaction(id = transaction_id, **trasaction_params)
    return jsonify(response=message)


#By Tier 2
@transaction_api.route("/ApproveMoneyTransferCritical/<transaction_id>", methods=['POST'])
def approve_money_transfer_critical(transaction_id):
    app.logger.info("[api-ApproveMoneyTransferCritical]")
    trasaction_params = request.json
    # get email or phone number or account number as parameter
    #perform checks on params and format them
    message = update_transaction(id = transaction_id, **trasaction_params)
    return jsonify(response=message)    


#By Merchant