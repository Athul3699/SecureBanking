from flask import Blueprint, request, jsonify, make_response
from flask import Flask, Response
from functools import wraps
from backend.models.manage import User

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
            token = request.headers.get('token')
            if token:
                user = User.query.filter_by(
                    activeJWT=token
                ).first()

                if user is None:
                    responseObject = {
                        'status': 'failure',
                        'data': 'Provide a valid auth token.'
                    }
                    return make_response(jsonify(responseObject)), 401
                else:
                    auth_token = token
            else:
                auth_token = ''
        if auth_token:
            try:
                resp = User.decode_auth_token(auth_token)
                return f(*args, **kwargs)
            except ValueError as err:
                print(err)
                responseObject = {
                    'status': 'failure',
                    'data': 'Some error occurred'
                }
                return make_response(jsonify(responseObject)), 401
            responseObject = {
                'status': 'failure',
                'data': resp
            }
            return make_response(jsonify(responseObject)), 401
        else:
            responseObject = {
                'status': 'failure',
                'data': 'Provide a valid auth token.'
            }
            return make_response(jsonify(responseObject)), 401
    return wrapper
