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
        token= request.args.get('token')

        if not token:
            return jsonify({'message' : 'Missing: token'}), 403

        try:
            date= jwt.decode(token, app.config['SECRET_KEY'])
        except:
            return jsonify({'message' : 'Invalid token!'}), 403

        return f(*args, **kwargs)

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
    
    if not auth or not auth.username or not auth.password:
        return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})

    pwd_hashed = generate_password_hash("password", method='sha256', salt_length=6)
    user_hashed = generate_password_hash("username", method='sha256', salt_length=6)
    
    if auth and check_password_hash(pwd_hashed, auth.password) and check_password_hash(user_hashed, auth.username):
        token = jwt.encode({'user': auth.username, 'exp' : datetime.datetime.utcnow()+ datetime.timedelta(minutes=15)}, app.config['SECRET_KEY'])

        return jsonify({'token' : token.decode('UTF-8')})
    else:
        return jsonify({'message' : 'Incorrect username/password!'})

if __name__== '__main__':
    app.run(debug=True)
