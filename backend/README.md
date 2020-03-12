# Requirements for backend app
Python 3.6+
pip3

## Packages to be installed
`Flask==1.1.1`

## How to run
for linux/mac users

`cd backend/api`
`export FLASK_APP=driver.py`
`flask run`

for windows users

`cd backend/api`
`set FLASK_APP=driver.py`
`flask run`

## To setup database
1) Install postgres on local machine 
2) Create a database named 'securebank'
3) Commands to create schema
 
     a) `cd backend/model`
      
     b) `python3 manage.py db init` [Only for the first time]
     
     c) `python3 manage.py db migrate`

     d) `python3 manage.py db upgrade`
# useful documentation

Flask - https://flask.palletsprojects.com/en/1.1.x/
