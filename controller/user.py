from flask import jsonify
from model.user import UserDAO
from model.to_do import ToDoDAO
class BaseUser:

    def build_map_dict(self, row):
        result = {}
        result['uid'] = row[0]
        result['ufirstname'] = row[1]
        result['ulastname'] = row[2]
        result['username'] = row[3]
        result['uemail'] = row[4]
        result['upassword'] = row[5]
        return result

    def build_attr_dict(self, uid, username, uemail, upassword, ufirstname, ulastname):
        result = {}
        result['uid'] = uid
        result['ufirstname'] = ufirstname
        result['ulastname'] = ulastname
        result['username'] = username
        result['uemail'] = uemail
        result['upassword'] = upassword
        return result

    def getAllUsers(self):
        dao = UserDAO()
        userlist = dao.getAllUsers()
        result = []
        for row in userlist:
            obj = self.build_map_dict(row)
            result.append(obj)
        return jsonify(result), 200

    def addNewUser(self, json):
        dao = UserDAO()
        username = json['username']
        uemail = json['uemail']
        upassword = json['upassword']
        ufirstname = json['ufirstname']
        ulastname = json['ulastname']
        if dao.getUserByLoginInformation(username, upassword):
            return jsonify("User is already in database"), 500
        else:
            uid = dao.insertNewUser(username, uemail, upassword, ufirstname, ulastname)
            result = self.build_attr_dict(uid, username, uemail, upassword, ufirstname, ulastname)
            return jsonify(result), 200


    def updateUser(self, uid, json):
        dao = UserDAO()
        ufirstname = json['ufirstname']
        ulastname = json['ulastname']
        username = json['username']
        uemail = json['uemail']
        upassword = json['upassword']
        updatedUser = dao.updateUser(uid, ufirstname, ulastname, username, uemail, upassword)
        return jsonify(self.build_attr_dict(updatedUser, username, uemail, upassword, ufirstname, ulastname)), 200

    def deleteUser(self, uid):
        dao = UserDAO()
        result = dao.deleteUser(uid)
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404

    def getUserByUserID(self, uid):
        dao = UserDAO()
        user = dao.getUserByUserID(uid)
        result = self.build_map_dict(user)
        result['tasks'] = ToDoDAO().getUserToDoListCount(uid)
        if not user:
            return jsonify("404 User Not Found"), 404
        else:
            return jsonify(result), 200

    def validateUser(self, json):
        dao = UserDAO()
        username = json['username']
        upassword = json['upassword']
        count = dao.validateUser(username, upassword)
        user = dao.getUserByLoginInformation(username, upassword)

        if count > 0:
            return jsonify({"valid": True, "uid": user[0]}), 200
        else:
            return jsonify({"valid": False}), 404