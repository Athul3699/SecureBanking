from flask import Flask, render_template, make_response
import pdfkit
import csv
import pandas as pd
import psycopg2


config = pdfkit.configuration(wkhtmltopdf="C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe")
app= Flask(__name__)
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

class db:
    def __init__(self):
        #connect to the db
        self.con = psycopg2.connect(
                    host = "localhost",
                    database="postgres",
                    user = "postgres",
                    password = "Pratima@77")
    def get_users(self):
        res = []
        cur = self.con.cursor() #cursor
        cur.execute("select user_id from data") #execute query
        rows = cur.fetchall()
        for r in rows:
            res.append(r[0])
        cur.close() #close the cursor
        return res

    def get_transactions(self):
        res = []
        cur = self.con.cursor() #cursor
        cur.execute("select transactions from data") #execute query
        rows = cur.fetchall()
        for r in rows:
            res.append(r[0])
        cur.close() #close the cursor
        return res

    def get_one_transaction(self, user_id):
        cur = self.con.cursor()
        cur.execute("select transactions from data where user_id =" + str(user_id))
        rows = cur.fetchone()
        cur.close()
        return rows[0]

    def close(self):
        # close the connection
        self.con.close()

if __name__ == '__main__':
    d = db()
    keys = d.get_users()
    transactions = d.get_transactions()
    for i, key in enumerate(keys):
        mydict[key] = transactions[i]

    app.run(debug=True)

