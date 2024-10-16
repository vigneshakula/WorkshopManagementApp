from flask import Flask,jsonify,request,json,make_response
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity,get_jwt
import json
from bson import ObjectId
from pymongo.mongo_client import MongoClient
from flask_cors import CORS 
from pymongo.server_api import ServerApi
from datetime import timedelta
from urllib.parse import quote_plus

username = quote_plus('vigneshakula230')
password = quote_plus('moremoney@12345')

url=f"mongodb+srv://vigneshakula230:{password}@cluster0.4qfmq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(url, server_api=ServerApi('1'))
db = client["workshopmanagement"]
app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] ="ramachandracollege"
jwt =JWTManager(app)
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return super(JSONEncoder, self).default(o)




@app.post('/login/student')
def studentLogin():
    if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400
        
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    user = db.student.find_one({"username":username})
    if user :
        if user["password"]==password:
            additional_claims = {
                    'role': 'student'   }
            jwt_token = create_access_token(identity={'username': username},additional_claims=additional_claims)
            return jsonify({
                "jwt_token" : jwt_token
            })
        return jsonify({"errormsg":"Invalid password"})
    return jsonify({
        "errormsg" : "invalid username or password"
    })

@app.post('/login/admin')
def adminLogin():
        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400
        
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        
        user = db.admin.find_one({"username": username})
        if user:
            if user["password"] == password:
                additional_claims = {'role': 'admin'}
                jwt_token = create_access_token(identity={'username': username}, additional_claims=additional_claims)
                return jsonify(jwt_token=jwt_token), 200

            return jsonify({"errormsg": "Invalid password"}), 401

        return jsonify({"errormsg": "Invalid username or password"}), 401



@app.post('/create/workshops')
@jwt_required()
def addWorkshop() :
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    data = request.get_json()
    if data['role']=="student" :
        return {"msg":"you dont have access to this resource"},400
    
    workshopname=data['name']
    date=data['date']
    workshop_id = "_".join(workshopname.split())
    db.workshops.insert_one({
        "name" : workshopname,
        "date" : date,
        "workshop_id" :  workshop_id,
        "students" : [],
        "feedbacks" : []
    })
    return jsonify({"msg":"added"}),200

@app.get('/getworkshops')
@jwt_required()
def getWorkshops() :
     workshops = db.workshops.find({},{"name":1,"date":1,"workshop_id":1})
     workshops = list(workshops)
     json_data = json.dumps(workshops, cls=JSONEncoder)
     return ({"workshops":json_data})
     
     


@app.post('/getadminworkshopdetails')
@jwt_required()
def getRegisteredStudents() :
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    data = request.get_json()
    if data['role']=="student" :
        return {"msg":"you dont have access to this resource"}
    workshopId = data["workshopId"]
    workshopDetails = db.workshops.find_one({"workshop_id":workshopId})
    name = workshopDetails["name"]
    date = workshopDetails["date"]
    students = workshopDetails["students"]
    feedbacks = workshopDetails["feedbacks"]

    return jsonify({
        "name" : name,
        "date" : date,
        "students" : students,
        "feedbacks" : feedbacks
    })
    

@app.post('/register')
@jwt_required()
def registerWorshop() :
    data = request.get_json()
    username =get_jwt_identity().get('username')
    result = db.workshops.find_one({"workshop_id":data["workshopId"]})
    students = result["students"]
    if username in students :
        return jsonify({"msg":"already registered"})
    students.append(username)
    db.workshops.update_many({"workshop_id":data["workshopId"]},{"$set" : {"students":students}})
    student =db.student.find_one({"username":username})
    worshops_registered = student.get("workshops_registered")
    worshops_registered.append({
        "workshopId" : data.get("workshopId"),
        "rating" :"",
        "feedback": ""
    })
    db.student.update_many({"username":username},{
        "$set" : {"workshops_registered" : worshops_registered}
    }) 
    return jsonify({
        "msg" : "added"
    }),200



@app.post("/studentworkshopdetails")
@jwt_required()
def getStudentsWorkshopDetails() :
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    username =get_jwt_identity().get('username')
    data = request.get_json()
    worshopId = data.get("workshopId")
    workshopdetails = db.workshops.find_one({"workshop_id":worshopId})
    workshops = db.student.find_one({"username":username}).get("workshops_registered")
    if len(workshops)==0 :
        return jsonify({
                    "name" : workshopdetails.get("name"),
                    "date" : workshopdetails.get("date"),
                    "isRegister" : "no",
                    "feedback" : "",
                    "rating" : ""})
    for i in workshops :
        if i["workshopId"] == worshopId :
            if i["feedback"]!="" :
                return jsonify({
                    "name" : workshopdetails.get("name"),
                    "date" : workshopdetails.get("date"),
                    "isRegister" : "yes",
                    "feedback" : i["feedback"],
                    "rating" : i["rating"]
                })
            else :
                return jsonify({
                    "name" : workshopdetails.get("name"),
                    "date" : workshopdetails.get("date"),
                    "isRegister" : "yes",
                    "feedback" : "",
                    "rating" : ""})
    
    return jsonify({
                    "name" : workshopdetails.get("name"),
                    "date" : workshopdetails.get("date"),
                    "isRegister" : "no",
                    "feedback" : "",
                    "rating" : ""})
        

@app.post("/postfeedback")
@jwt_required()
def postFeedback() :
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    data = request.get_json()
    username = get_jwt_identity().get("username")
    rating = data.get("rating")
    feedback = data.get("feedback")
    workshopId = data.get("workshopId")
    registeredWorkshops = db.student.find_one({"username":username},{"workshops_registered":1}).get("workshops_registered")
    for i in registeredWorkshops :
        if i.get("workshopId")==workshopId :
            i["rating"]=rating
            i["feedback"] = feedback
            break
    db.student.update_many({"username":username},{
        "$set" : {"workshops_registered":registeredWorkshops}
    })
    feedbacklist = db.workshops.find_one({"workshop_id":workshopId}).get("feedbacks")
    feedbacklist.append({
        "feedback" : feedback,
        "rating" : rating
    })
    db.workshops.update_many({"workshop_id":workshopId},{
        "$set" : {"feedbacks":feedbacklist}
    })
    return jsonify({
        "msg":"feedback added"
    }),200



@app.post("/addnewadmin")
@jwt_required()
def addAdmin() :
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    data = request.get_json()
    if data.get("role")=="student" :
        return jsonify({"msg":"you dont have access to this api"}),400
    username=data.get("username")
    password= data.get("password")
    admin = db.admin.find_one({"username":username})
    if admin :
        return jsonify({"msg" : "Username is already taken"}),400
    db.admin.insert_one({
        "username":username,
        "password":password
    })
    return jsonify({"msg":"Succesfully added"}),200


@app.post("/addnewstudent")
@jwt_required()
def addStudent() :
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    data = request.get_json()
    if data.get("role")=="student" :
        return jsonify({"msg":"you dont have access to this api"}),400
    username=data.get("username")
    password= data.get("password")
    admin = db.student.find_one({"username":username})
    if admin :
        return jsonify({"msg" : "Username is already taken"}),400
    db.student.insert_one({
        "username":username,
        "password":password,
        "workshops_registered" :[]
    })
    return jsonify({"msg":"Succesfully added"}),200



if __name__ == "__main__" :
    app.run(debug=True)

