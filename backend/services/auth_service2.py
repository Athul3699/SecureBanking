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
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30, seconds=1200),
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
        #password_hash = encrypt(data['password'])

        if user and user.password == password_hash:
            session_t = get_session(email=user.email)

            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1, seconds=1200),
                'email': user.email,
                'sequence_number': session_t['seq_number']+1
            }

            auth_token = jwt.encode(
                payload,
                "justatest",
                algorithm='HS256'
            )

            message = add_session(email=user.email, seq_number=session_t['seq_number']+1)

            return "success", str(auth_token)[2:-1]
        else:
            return "failure", "user does not exist"
    except Exception as e:
        print(e)
        return "failure", "some error occured"
