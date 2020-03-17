from flask import jsonify, g, Blueprint, request
from backend import app
from backend.services import auth_service

auth_api = Blueprint('auth_api', __name__)


@auth_api.route("/login_user", methods=['POST'])
def login():
    app.logger.info("[api-login-user]")
    args = request.json

    email = args['email']
    password = args['password']
    
    return auth_service.login_user(email=email, password=password)