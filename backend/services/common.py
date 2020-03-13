from securebankingsystem.backend.model.manage import *
from securebankingsystem import backend

def get_customer_accounts(user_id):
    accounts_qs = Bankaccount.query.filter_by(user_id=user_id)
    accounts = []
    for record in accounts_qs:
        accounts.append(record.__dict__)
    return accounts

def get_profile_information(user_id):
    profiles_qs =  User.query.filter_by(id=user_id)
    profiles = []
    for record in profiles_qs:
        profiles.append(record.__dict__)
    return profiles
