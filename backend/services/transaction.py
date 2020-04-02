from backend import app
from backend.model.manage import Authorizedrole, Maintenancelog, User, Bankaccount, Signinhistory, Transaction, Appointment
from backend.services.security_util import encrypt
from backend.services.constants import *


def isCritical(user_id, current_transaction_amount):
    todays_datetime = datetime(datetime.today().year, datetime.today().month, datetime.today().day)
    transaction_qs = Transaction.query.filter_by(is_active==True, initiated_time >= todays_datetime, initiated_by==user_id)
    sum_of_transfer_amount_today = 0
    for record in transaction_qs:
        sum_of_transfer_amount_today+=record.amount
    if sum_of_transfer_amount_today+current_transaction_amount>=1000:
        return True
    else:
        return False


def get_transactions(**kwargs):
    transaction_qs = Transaction.query.filter_by(**kwargs)
    transactions = []
    for record in transaction_qs:
        record_dict = record.__dict__
        if "_sa_instance_state" in record_dict:
            record_dict.pop("_sa_instance_state")
        transactions.append(record_dict)
    return transactions


def get_transactions_within(start_date,  end_date, accountnumber):
    transaction_qs1 = Transaction.query.filter(app.db.and_(Transaction.initiated_time >= start_date, Transaction.initiated_time <= end_date, Transaction.from_account==accountnumber, Transaction.status=="Approved", Transaction.is_active==True)).all()
    transaction_qs2 = Transaction.query.filter(app.db.and_(Transaction.initiated_time >= start_date, Transaction.initiated_time <= end_date, Transaction.to_account==accountnumber, Transaction.status=="Approved", Transaction.is_active==True)).all()
    transactions = []

    for record in transaction_qs1:
        record_dict = record.__dict__
        if "_sa_instance_state" in record_dict:
            record_dict.pop("_sa_instance_state")
        transactions.append(record_dict)

    for record in transaction_qs2:
        record_dict = record.__dict__
        if "_sa_instance_state" in record_dict:
            record_dict.pop("_sa_instance_state")
        transactions.append(record_dict)

    return transactions 



def add_transaction(**kwargs):
    transaction_qs = Transaction.query.filter_by(**kwargs)#only based on primary key or unique element
    if transaction_qs.count()==0:
        transaction = Transaction(**kwargs)
        app.db.session.add(transaction)
        app.db.session.commit()
        return "Transaction added!"
    else:
        return "Transaction already exists"


def update_transaction(id, **kwargs):
    result = "success"
    try:
        keys = kwargs.keys()
        transaction = app.db.session.query(Transaction).filter_by(id=id).first()
        for key in keys:
            exec("transaction.{0} = kwargs['{0}']".format(key))
        app.db.session.commit()
    except:
        result = "error"
    return result


def delete_transaction(id):
    pass # might need to reorganize all other functions