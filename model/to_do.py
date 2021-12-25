from config.dbconfig import pg_config
import psycopg2
import json

class ToDoDAO:
    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s port=%s host='ec2-34-206-8-52.compute-1.amazonaws.com'" % (pg_config['dbname'], pg_config['user'], pg_config['password'], pg_config['dbport'])
        print("connection url:", connection_url)
        self.conn = psycopg2.connect(connection_url)

    def __del__(self):
        self.conn.close()

    def getAllToDoTasks(self):
        cursor = self.conn.cursor()
        query = "select tdid, tdtask, tddate, tdtime, uid from public.to_do;"
        cursor.execute(query)
        result = [r for r in cursor]
        cursor.close()
        return result

    def addNewToDoTask(self, tdtask, tddate, tdtime, uid):
        """
        JSON Format:

        {
            "tdtask" : Finish Web App,
            "tddate" : 2021-12-25,
            "tddate" : 23:59,
            "uid", 1
        }
        """
        cursor = self.conn.cursor()
        query = "insert into public.to_do(tdtask, tddate, tdtime, uid) values(%s, %s, %s, %s) returning tdid;"
        cursor.execute(query, (tdtask, tddate, tdtime, uid))
        tdid = cursor.fetchone()[0]
        self.conn.commit()
        cursor.close()
        return tdid


    def updateToDoTask(self, tdid, tdtask, tddate, tdtime, uid):
        cursor = self.conn.cursor()
        query = "update public.to_do set tdtask = %s, tddate = %s, tdtime = %s where tdid = %s;"
        cursor.execute(query, (tdtask, tddate, tdtime, tdid))
        self.conn.commit()
        cursor.close()
        return tdid

    def deleteToDoTask(self, tdid):
        cursor = self.conn.cursor()
        query = "delete from public.to_do where tdid=%s;"
        cursor.execute(query, (tdid,))
        isDeleted = cursor.rowcount > 0
        self.conn.commit()
        cursor.close()
        return isDeleted

    def getUserToDoList(self, uid):
        cursor = self.conn.cursor()
        query = "select tdid, tdtask, tddate, tdtime, uid from public.to_do where uid=%s;"
        cursor.execute(query, (uid,))
        toDoList = [row for row in cursor]
        cursor.close()
        return toDoList

    def verifyOwner(self, uid, tdid):
        cursor = self.conn.cursor()
        query = "select uid from public.to_do where tdid=%s;"
        cursor.execute(query, (tdid,))
        userID = cursor.fetchone()[0]
        return int(userID) == int(uid)

    def getUserToDoListCount(self, uid):
        cursor = self.conn.cursor()
        query = "select count(*) from public.to_do where uid=%s;"
        cursor.execute(query, (uid,))
        return cursor.fetchone()[0]
