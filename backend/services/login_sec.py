from flask import Flask, jsonify, request, make_response
import jwt
import datetime
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash

app= Flask(__name__)
app.config['SECRET_KEY'] = '$$group10'

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return jsonify({'message' : 'Token is missing!'}), 401

        try: 
            data = jwt.decode(token, app.config['SECRET_KEY'])
            current_user = User.query.filter_by(public_id=data['public_id']).first()
        except:
            return jsonify({'message' : 'Token is invalid!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated
     

@app.route('/unprotected')
def unprotected():
    return jsonify({'message' : 'Can be viewed by anyone.'})

@app.route('/protected')
@token_required
def protected():
    return jsonify({'message' : 'Can be viewed with valid tokens only.'})

@app.route('/login')
def login():
    auth = request.authorization
    
    if not auth or not auth.password:
        return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required."'})

    pwd_hashed = generate_password_hash("password", method='sha256', salt_length=6)
    
    if auth and check_password_hash(pwd_hashed, auth.password):
        token = jwt.encode({'user': auth.username, 'exp' : datetime.datetime.utcnow()+ datetime.timedelta(minutes=15)}, app.config['SECRET_KEY'])

        return jsonify({'token' : token.decode('UTF-8')})
    else:
        return jsonify({'message' : 'Incorrect password!'})

    return make_response('Unable to verify.', 401, {'WWW-Authenticate': 'Basic realm= "Login Required"'})

    
if __name__== '__main__':
    app.run(debug=True)
