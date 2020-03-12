from flask import Flask, jsonify, request, make_response
import jwt
import datetime
from functools import wraps
from sec import token_required, encrypt, check_decrypt


app= Flask(__name__)

app.config['SECRET_KEY'] = '$$group10'
   
flag=1

#API to login with limited attempts for wrong password (3 attempts)
@app.route('/login')
def login():
    auth = request.authorization
    if not auth or not auth.username or not auth.password:
        return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})
    
    #These 2 lines should be added to function to register user in the DB.
    pwd_hashed = encrypt("password")
    user_hashed = encrypt("username")


    global flag
    while auth and flag <=3:
        if check_decrypt(user_hashed, auth.username):
            if check_decrypt(pwd_hashed, auth.password):
                token = jwt.encode({'user': auth.username, 'exp' : datetime.datetime.utcnow()+ datetime.timedelta(seconds=30)}, app.config['SECRET_KEY'])
                return jsonify({'token' : token.decode('UTF-8')})
            else: 
                flag +=1
                return make_response(jsonify({'message' : 'Incorrect password'}), 401, {'WWW-Authenticate': 'Basic realm= "Login Required"'})
                
        else: 
            return make_response(jsonify({'message' : 'Incorrect username'}), 401, {'WWW-Authenticate': 'Basic realm= "Login Required"'})       
            
    else:
        return jsonify({'message' : 'Email sent!'})
        

if __name__== '__main__':
    app.run(debug=True)
