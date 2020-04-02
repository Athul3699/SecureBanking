import psycopg2

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

    def get_secret_key(self):
        cur = self.con.cursor()
        cur.execute("select secret_key from secret")
        rows = cur.fetchone()
        cur.close()
        return rows[0]

    def get_passwords(self):
        res = []
        cur = self.con.cursor() #cursor
        cur.execute("select password from data") #execute query
        rows = cur.fetchall()
        for r in rows:
            res.append(r[0])
        cur.close() #close the cursor
        return res

    def get_one_password(self, user_id):
        cur = self.con.cursor()
        cur.execute("select password from data where user_id =" + str(user_id))
        rows = cur.fetchone()
        cur.close()
        return rows[0]

    def update_password(self, new_password, user_id):
        cur = self.con.cursor()
        cur.execute("update data set password=" + "'" + str(new_password) + "'" + " where user_id =" + str(user_id))
        cur.execute("commit")
        cur.close()

    def close(self):
        # close the connection
        self.con.close()