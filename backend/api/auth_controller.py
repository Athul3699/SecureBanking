from flask import jsonify, g, Blueprint, request
from backend import app
from backend.services import auth_service

auth_api = Blueprint('auth_api', __name__)


@auth_api.route("/login_user", methods=['POST'])
def login():
    app.logger.info("[api-login-user]")
    email = request.form['email']
    password = request.form['password']
    
    status, token = auth_service.login_user(email=email, password=password)

    return jsonify({"status": status, "token": token })