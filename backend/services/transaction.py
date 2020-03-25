from backend import app
from backend.model.manage import Authorizedrole, Maintenancelog, User, Bankaccount, Signinhistory, Transaction, Appointment
from backend.services.security_util import encrypt
from backend.services.constants import *

def isCritical(id, current_transaction_amount):
    if current_transaction_amount>=1000:
        return True
    else:
        return False


def get_transactions(**kwargs):
    transaction_qs = Transaction.query.filter_by(**kwargs)
    transactions = []
    for record in transaction_qs:
        transactions.append(record.__dict__)
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
