from flask import Flask, request
from controller.user import BaseUser
from controller.to_do import BaseToDo
import json

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/api/users', methods=['GET', 'POST'])
def handleUsers():
    if request.method == 'GET':
        return BaseUser().getAllUsers()
    else:
        return BaseUser().addNewUser(request.json)


@app.route('/api/users/<int:uid>', methods=['GET', 'PUT', 'DELETE'])
def handleUserByID(uid):
    if request.method == 'GET':
        return BaseUser().getUserByUserID(uid)
    elif request.method == 'DELETE':
        return BaseUser().deleteUser(uid)
    else:
        return BaseUser().updateUser(uid, request.json)

@app.route('/api/todo', methods=['GET', 'POST'])
def handleToDo():
    if request.method == 'GET':
        return BaseToDo().getAllToDoTasks()
    else:
        return BaseToDo().addNewToDoTask(request.json)

@app.route('/api/todo/<int:tdid>', methods=['PUT', 'DELETE'])
def handleToDosByID(tdid):
    if request.method == "PUT":
        return BaseToDo().updateToDoTask(tdid, request.json)
    else:
        return BaseToDo().deleteToDoTask(tdid)

@app.route('/api/todo/<int:uid>', methods=['GET'])
def handleUserToDoListFecth(uid):
    return BaseToDo().getUserToDoList(uid)

@app.route('/api/todo/remainingTasks/<int:uid>', methods=['GET'])
def handleUserToDoListCountFecth(uid):
    return BaseToDo().getUserToDoListCount(uid)

@app.route('/api/users/validation', methods=['POST'])
def handleUserValidation():
    return BaseUser().validateUser(request.json)



if __name__ == '__main__':
    app.run(debug=True, port=8080)
