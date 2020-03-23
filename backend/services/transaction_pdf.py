from flask import Flask, render_template, make_response
import pdfkit
import csv
import pandas as pd
import psycopg2
from database import db

config = pdfkit.configuration(wkhtmltopdf="C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe")
app= Flask(__name__)
app.config['SECRET_KEY'] = '$$group10'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Pratima@77@localhost/postgres'

mydict = {}

@app.route('/view')
def pdf_view():
    (pd.DataFrame.from_dict(data=mydict, orient='index').to_csv('dict.csv', header=False))

    with open('dict.csv') as f:
        pdf = pdfkit.from_file(f, False, configuration=config)

    response = make_response(pdf)
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = 'inline; filename= transaction.pdf'  # For viewing

    return response


@app.route('/download')
def pdf_download():
    (pd.DataFrame.from_dict(data=mydict, orient='index').to_csv('dict.csv', header=False))

    with open('dict.csv') as f:
        pdf = pdfkit.from_file(f, False, configuration=config)

    response = make_response(pdf)
    response.headers['Content-Type'] = 'application/pdf'
    response.headers[
        'Content-Disposition'] = 'attachment; filename= transaction.pdf'  # For downloading the pdf to local computer

    return response

if __name__ == '__main__':
    d = db()
    keys = d.get_users()
    transactions = d.get_transactions()
    for i, key in enumerate(keys):
        mydict[key] = transactions[i]

    app.run(debug=True)

