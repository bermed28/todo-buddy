from config.dbconfig import pg_config
import psycopg2
import json

class UserDAO:
    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s port=%s host='ec2-34-206-8-52.compute-1.amazonaws.com'" % (pg_config['dbname'], pg_config['user'], pg_config['password'], pg_config['dbport'])
        print("connection url:", connection_url)
        self.conn = psycopg2.connect(connection_url)

    def __del__(self):
        self.conn.close()

    def getAllUsers(self):
        cursor = self.conn.cursor()
        query = "select uid, ufirstname, ulastname, username, uemail, upassword from public.user;"
        cursor.execute(query)
        result = [r for r in cursor]
        cursor.close()
        return result

    def insertNewUser(self, username, uemail, upassword, ufirstname, ulastname):
        cursor = self.conn.cursor()
        query = 'insert into public.user(ufirstname, ulastname, username, uemail, upassword) values (%s, %s, %s, %s, %s) returning uid;'
        cursor.execute(query, (ufirstname, ulastname, username, uemail, upassword))
        uid = cursor.fetchone()[0]
        self.conn.commit()
        cursor.close()
        return uid

    def updateUser(self, uid, ufirstname, ulastname, username, uemail, upassword):
        cursor = self.conn.cursor()
        query = "update public.user set ufirstname = %s, ulastname = %s, username = %s, uemail = %s, upassword = %s where uid = %s;"
        cursor.execute(query, (ufirstname, ulastname, username, uemail, upassword, uid))
        self.conn.commit()
        cursor.close()
        return uid

    def deleteUser(self, uid):
        cursor = self.conn.cursor()
        query = "delete from public.user where uid=%s;"
        cursor.execute(query, (uid,))
        isDeleted = cursor.rowcount > 0
        self.conn.commit()
        return isDeleted

    def getUserByUserID(self, uid):
        cursor = self.conn.cursor()
        query = "select uid, ufirstname, ulastname, username, uemail, upassword from public.user where uid=%s;"
        cursor.execute(query, (uid,))
        result = cursor.fetchone()
        return result

    def getUserByLoginInformation(self, username, password):
        cursor = self.conn.cursor()
        query = "select uid, ufirstname, ulastname, username, uemail, upassword from public.user where username=%s and upassword=%s;"
        cursor.execute(query, (username,password))
        result = cursor.fetchone()
        return result

    def validateUser(self, username, upassword):
        cursor = self.conn.cursor()
        query = "select count(*) from public.user where username=%s and upassword=%s;"
        cursor.execute(query, (username, upassword))
        return cursor.fetchone()[0]


