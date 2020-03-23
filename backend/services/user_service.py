from flask import make_response
from backend import app
import datetime
from backend.services.common import *
from backend.services.constants import *
# import pdfkit
import pandas as pd
import csv

def generate_statements(data):
    # get data from db
    # 
    
    # (pd.DataFrame.from_dict(data=data, orient='index').to_csv('dict.csv', header=False))

    # with open('dict.csv') as f:
    #     pdf = pdfkit.from_file(f, False)

    # response = make_response(pdf)
    # response.headers['Content-Type'] = 'application/pdf'
    # response.headers['Content-Disposition'] = 'attachment; filename= transaction.pdf'  

    return None