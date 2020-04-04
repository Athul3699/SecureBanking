from flask import Blueprint, request, jsonify, make_response
from flask import Flask, Response
from functools import wraps
from backend.model.manage import User
from backend import app

""" login_user call in that, we replace the active jwt token if credentials are valid """

"""
1. User has a token, makes a request with it - REQUEST
2. If yes, check if it not blacklisted -- USER HAS NOT LOGGED OUT
3. Then check if the token has not expired -- USER LOGGED IN, BUT TOKEN HAS NOT EXPIRED YET
4. On all requests that require login, match users JWT-string and activeJWT. if they dont match, it means another device is logged in -- make the old token useless.
4a. Blacklist token
4b. 
5. If yes, we just return execution and assume they are authenticated.
6. If it does not match, the user is not authenticated as we are maintaining one activeJWT token at all times and ask them to login again...
"""

# def authenticate(f):
#     @wraps(f)
#     def wrapper(*args, **kwargs):
#         token = request.headers.get('token')

#         if token:
#             try:
#                 token = request.headers.get('token')
#                 resp = User.decode_auth_token(token) # step 2 and 3

#                 # query db, step 4
#                 user = User.query.filter_by(activeJWT=token).first()

#                 if user is None:
#                     return make_response({ "status": "failure", "message": "Unauthorized..."}), 401
#                 else:
#                     return f(*args, **kwargs)
                
#             except Exception as e:
#                 print(e)

#                 return make_response({ "status": "failure", "message": "Unauthorized..."}), 401
#     return wrapper

def authenticate(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get('Authorizationtok')
        if auth_header:
            try:
                auth_token = auth_header.split(" ")[1]
            except IndexError:
                responseObject = {
                    'status': 'failure',
                    'data': 'Bearer token malformed.'
                }
                return make_response(jsonify(responseObject)), 401
        else:
            auth_token = request.headers.get('token')

        if auth_token:
            try:
                payload = jwt.decode(auth_token, "justatest", algorithm='HS256')
                decoded_email = payload['email']
                decoded_seq_number = payload['seq_number']
                session_t = get_session(email=user.email)
                if decoded_seq_number==session_t.seq_number:
                    message = add_session(decoded_email,decoded_seq_number+1)
                    return f(*args, **kwargs)
                else:
                    message = "You are already logged in..Please log in again"

            except jwt.ExpiredSignatureError:
                message = 'Signature expired. Please log in again.'

            except jwt.InvalidTokenError:
                message = 'Invalid token. Please log in again.'

            responseObject = {
                'status': 'failure',
                'data': message
            }
            return make_response(jsonify(responseObject)), 401
        else:
            responseObject = {
                'status': 'failure',
                'data': 'Provide a valid auth token.'
            }
            return make_response(jsonify(responseObject)), 401
    return wrapper

