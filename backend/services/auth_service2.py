from backend import app
from flask import Flask, jsonify, request, make_response
from flask import current_app
import jwt
import datetime
from backend.services.common import *
from backend.services.security_util import token_required, encrypt, check_decrypt
from functools import wraps
import uuid
import hashlib

from backend.model.manage import User

def register_user(**data):
    user = User.query.filter_by(email=data['email']).first()
    if not user:
        try:
            # hash the password
            password_hash = hashlib.md5(
                str(data['password']).encode('utf-8')).hexdigest()
            #password_hash = encrypt(data['password'])
            
            ssn_hash = hashlib.md5(
                str(data['ssn']).encode('utf-8')).hexdigest()
            
            data['password'] = password_hash
            data['ssn'] = ssn_hash
            data['date_of_birth'] = datetime.datetime.strptime(data['date_of_birth'], '%Y/%m/%d')
           
           
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=1200),
                'email': data['email'],
                'seq_number':1
            }
            
            auth_token = jwt.encode(
                payload,
                "justatest",
                algorithm='HS256'
            )
            
            # data['activeJWT'] = auth_token

            # create a user object
            user = User(**data)
            app.db.session.add(user)
            app.db.session.commit()

            user_data = User.query.filter_by(email=data['email']).first()
            message = add_session(email=user.email, seq_number=1)
            if message=="success":
                message = add_incorrect_logins(user_email=user.email, incorrect_count=0, expires_at=datetime.datetime.utcnow() + datetime.timedelta(seconds=3000))
            return "success", str(auth_token)[2:-1]
            
        except Exception as e:
            print(e)
            return "failure", "Please Ensure You have entered SSN and contact number that's unique to you"            
    else:
        return "failure", "user already exists"


def login_user(**data):
    try:
        user = User.query.filter_by(email=data['email']).first()

        password_hash = hashlib.md5(str(data['password']).encode('utf-8')).hexdigest()

        if user:
            incor_login = get_incorrect_logins(user_email=user.email)
            incor_login = incor_login[0]
            if user.password == password_hash:
                if datetime.datetime.now()<=incor_login['expires_at'] and incor_login['incorrect_count']>=4:
                    return "failure", "Maximum incorrect login attempts reached...Please try after 5 hours"
                else:
                    message = update_incorrect_logins(user_email=user.email, incorrect_count=0)
                    if message=="error":
                        return "failure", "DB error"
                session_t = get_session(email=user.email)

            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=1200),
                'email': user.email,
                'seq_number': session_t['seq_number']+1
            }

                auth_token = jwt.encode(
                    payload,
                    "justatest",
                    algorithm='HS256'
                )

                message = add_session(email=user.email, seq_number=session_t['seq_number']+1)

                return "success", str(auth_token)[2:-1]
            else:
                if datetime.datetime.now()<=incor_login['expires_at']:
                    if incor_login['incorrect_count']>=4:
                        return "failure", "Maximum incorrect login attempts reached...Please try after 5 hours"
                    else:
                        count = incor_login['incorrect_count']+1
                        message = update_incorrect_logins(user_email=user.email, incorrect_count=count)
                        if message=="error":
                            return "failure", "DB error"
                        else:
                            return "failure", "Incorrect Password."+str(4-count)+" more Incorrect login attempts left"
                else:
                    message = update_incorrect_logins(user_email=user.email, incorrect_count=1, expires_at=datetime.datetime.utcnow() + datetime.timedelta(seconds=3000))
                    if message=="error":
                        return "failure", "DB error"
                    else:
                        return "failure", "Incorrect Password. 3 Incorrect login attempts left"
        else:
            return "failure", "user does not exist"
    except Exception as e:
        print(e)
        return "failure", "some error occured"
