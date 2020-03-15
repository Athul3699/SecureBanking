from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, jsonify, request, make_response
import jwt
import datetime
from functools import wraps

#Function to hash the credential after adding a salt of length=6.
def encrypt(credential):
    pwd_hashed = generate_password_hash(credential, method='sha256', salt_length=6)
    return pwd_hashed

#Function to check if the salted credentials match with the input value.
def check_decrypt(hash_credential, input_auth):
    check_flag= check_password_hash(hash_credential, input_auth)
    return check_flag

#Function to ensure token is valid
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token= request.args.get('token')

        if not token:
            return jsonify({'message' : 'Missing: token'}), 403

        try:
            date = jwt.decode(token, app.config['SECRET_KEY'])
        except:
            return jsonify({'message' : 'Invalid token!'}), 403

        return f(*args, **kwargs)

    return decorated