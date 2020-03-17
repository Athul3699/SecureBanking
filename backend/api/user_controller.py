from flask import jsonify, g, Blueprint, request
from backend import app
from ..services import user_service
from ..services.common import *
from ..services.constants import *

user_api = Blueprint('user_api', __name__)


@user_api.route("/InitiateModifyUser", methods=['POST'])
def initiate_modify_user():
    app.logger.info("[api-initiate-modify-user]")
    args = request.json

    id = args['id']    
    response = update_user_account(id=id, edit_mode=True, edit_status=SUBMITTED)
    return jsonify(response=response)