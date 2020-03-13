from securebankingsystem.backend.model.manage import *
from securebankingsystem import backend

def get_customer_accounts(user_id):
    accounts_qs = Bankaccount.query.filter_by(user_id=user_id)
    accounts = []
    for record in accounts_qs:
        accounts.append(record.__dict__)
    return accounts

def get_profile_information(user_id):
    info =  User.query.get(user_id)
    if info is None:
        return []
    else:
        # Put masking logic for SSN and mobile number here
        return [info.__dict__]
