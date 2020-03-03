from sqlalchemy import create_engine
from sqlalchemy.dialects import sqlite
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
# print(sqlalchemy.__version__) # 1.1.13

engine = create_engine('sqlite:////:memory:', echo = True)
Base = declarative_base()

Session = sessionmaker()
Session.configure(bind=engine)

session = Session()

print(Base)

