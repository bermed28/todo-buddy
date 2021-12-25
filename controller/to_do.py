from flask import jsonify
from model.to_do import ToDoDAO

class BaseToDo:

    def build_map_dict(self, row):
        result = {}
        result['tdid'] = row[0]
        result['tdtask'] = row[1]
        result['tddate'] = str(row[2])
        result['tdtime'] = str(row[3])
        result['uid'] = row[4]
        return result

    def build_attr_dict(self, tdid, tdtask, tddate, tdtime, uid):
        result = {}
        result['tdid'] = tdid
        result['tdtask'] = tdtask
        result['tddate'] = str(tddate)
        result['tdtime'] = str(tdtime)
        result['uid'] = uid
        return result

    def getAllToDoTasks(self):
        dao = ToDoDAO()
        toDoList = dao.getAllToDoTasks()
        result = [self.build_map_dict(row) for row in toDoList]
        return jsonify(result), 200

    def addNewToDoTask(self, json):
        dao = ToDoDAO()
        tdtask = json['tdtask']
        tddate = json['tddate']
        tdtime = json['tdtime']
        uid = json['uid']
        tdid = dao.addNewToDoTask(tdtask, tddate, tdtime, uid)
        return jsonify(self.build_attr_dict(tdid, tdtask, tddate, tdtime, uid)), 200

    def updateToDoTask(self, tdid, json):
        dao = ToDoDAO()
        tdtask = json['tdtask']
        tddate = json['tddate']
        tdtime = json['tdtime']
        uid = json['uid']
        verified = dao.verifyOwner(uid, tdid)
        if verified:
            updatedTask = dao.updateToDoTask(tdid, tdtask, tddate, tdtime, uid)
            return jsonify(self.build_attr_dict(updatedTask, tdtask, tddate, tdtime, uid)), 200
        else:
            return jsonify("You cannot edit this ask because you are not the owner of it"), 500

    def deleteToDoTask(self, tdid):
        dao = ToDoDAO()
        result = dao.deleteToDoTask(tdid)
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404

    def getUserToDoList(self, uid):
        dao = ToDoDAO()
        userToDoList = dao.getUserToDoList(uid)
        if not userToDoList:
            return jsonify("404 User has no To-Do Tasks"), 404
        else:
            return jsonify([self.build_map_dict(row) for row in userToDoList]), 200

    def getUserToDoListCount(self, uid):
        dao = ToDoDAO()
        return jsonify({"count": dao.getUserToDoListCount(uid)}), 200