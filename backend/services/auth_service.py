from backend import app
from flask import Flask, jsonify, request, make_response
from flask import current_app
import jwt
import datetime
from backend.services.common import *
from backend.services.security_util import token_required, encrypt, check_decrypt
from functools import wraps


flag_dict = {}
	
user = ['email']
for key in user:
    flag_dict[key]={}
    flag_dict[key]['flag_count'] = 0
    flag_dict[key]['expires_at'] = datetime.datetime.min

def login_user(email, password):
    if email is None or password is None:
        return "No credentials", None

    user = get_user_account(email=email)

    #import pdb; pdb.set_trace()
    if len(user) == 0:
        return "User doesn't exist", None

    pwd_hashed = encrypt(password)
    email_hashed = encrypt(email)

    global flag_dict
    if check_decrypt(email_hashed, email):
        if check_decrypt(pwd_hashed, password):
            token = jwt.encode({'user': email, 'exp' : datetime.datetime.utcnow()+ datetime.timedelta(seconds=40)}, current_app.config['SECRET_KEY'])
            return jsonify({'token' : token.decode('UTF-8')})

        else:
            cur_time= datetime.datetime.utcnow()
            if flag_dict[email]['flag_count']==0:
                expire_time = cur_time + datetime.timedelta(hours=5)
                flag_dict[email]['expires_at']= expire_time
        
            if datetime.datetime.utcnow() < flag_dict[email]['expires_at']:
                while flag_dict[email]['flag_count']<4:
                    flag_dict[email]['flag_count'] +=1
                    return make_response(jsonify({'message' : 'Incorrect password'}), 401, {'WWW-Authenticate': 'Basic realm= "Login Required"'})
                else:
                    return jsonify({'message' : 'Email sent!'})

            else: 
                flag_dict[email]['flag_count'] =0
                return make_response(jsonify({'message' : 'Incorrect password'}), 401, {'WWW-Authenticate': 'Basic realm= "Login Required"'})
            
    else: 
        return make_response(jsonify({'message' : 'Incorrect email'}), 401, {'WWW-Authenticate': 'Basic realm= "Login Required"'})
