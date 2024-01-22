import json
from datetime import timedelta

from bson import ObjectId
from flask import Flask, jsonify, request, send_file, Response
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from pymongo import MongoClient
from config import host, user, password, db_name
import os

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your_secret_key'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
jwt = JWTManager(app)

CORS(app)

# connect to MongoDB
cluster = MongoClient("mongodb://localhost:27017")
db = cluster["samara_region_site"]
places = db['places']
routes = db['routes']
category = db['category']
accounts = db['accounts']

# fill collection
def fill_collection(collection, data):
    if collection == 'places':
        places.insert_one(data)
    elif collection == 'routes':
        routes.insert_one(data)
    elif collection == 'category':
        category.insert_one(data)
    elif collection == 'accounts':
        accounts.insert_one(data)
    print('Data added to collection')

def serialize_object(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    raise TypeError(repr(obj) + " is not JSON serializable")

# show collection
def super_print(collection_name, category=None):
    if category and int(category) > -1:
        query = {"category": {"$regex": category}}
    else:
        query = {}

    if collection_name == 'places' or collection_name == 'routes':
        result = list(db[collection_name].aggregate([
            {
                "$match": query
            },
            {
                "$lookup":
                    {
                        "from": "category",
                        "localField": "category",
                        "foreignField": "_id",
                        "as": "category"
                    }
            },
            {
                "$lookup":
                    {
                        "from": "places",
                        "localField": "points",
                        "foreignField": "_id",
                        "as": "points"
                    }
            }
        ]))
    else:
        result = list(db[collection_name].find(query))
    serialized_result = json.loads(json.dumps(result, default=serialize_object))
    #for components in serialized_result:
    #    components['_id'] = str(components['_id'])
    return serialized_result


# delete something from collection
def delete_place(id, collection_name):
    db[collection_name].delete_one({"_id": ObjectId(id)})
    print('delete', super_print('category'))
    return Response(status=200)


# edit something from collection
def edit_collection(collection_name, changes, id):
    db[collection_name].update_one({"_id": ObjectId(id)}, {"$set": changes})


# get something from collection by id
def get_place_details_id(place_id, collection_name):
    print('place id get',place_id, collection_name)
    details = list(db[collection_name].aggregate([
        {
            "$match": {"_id": ObjectId(place_id)}
        },
        {
            "$lookup":
                {
                    "from": "category",
                    "localField": "category",
                    "foreignField": "_id",
                    "as": "category"
                }
        },
        {
            "$lookup":
                {
                    "from": "places",
                    "localField": "points",
                    "foreignField": "_id",
                    "as": "points"
                }
        }
    ]))[0]
    # details['_id'] = str(details['_id'])
    serialized_result = json.loads(json.dumps(details, default=serialize_object))
    return serialized_result


# get something from collection by name
def get_place_details_name(place_name, collection_name):
    details = list(db[collection_name].aggregate([
        {
            "$match": {"name": place_name}
        },
        {
            "$lookup":
                {
                    "from": "category",
                    "localField": "category",
                    "foreignField": "_id",
                    "as": "category"
                }
        },
        {
            "$lookup":
                {
                    "from": "places",
                    "localField": "points",
                    "foreignField": "_id",
                    "as": "points"
                }
        }
    ]))[0]
    serialized_result = json.loads(json.dumps(details, default=serialize_object))
    return serialized_result


# login as admin
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    passworded = request.json.get('password')

    if username == user and passworded == password:
        access_token = create_access_token(identity=username)
        print(access_token, 'token')
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"msg": "Неверный логин или пароль"}), 401


# return places
@app.route('/places')
def points_return():
    category = request.args.get('category')
    print(category)
    if category:
        return jsonify(super_print('places', category))
    else:
        return jsonify(super_print('places'))


# send routes
@app.route('/routes')
def routes_return():
    category = request.args.get('category')
    time_filter = request.args.get("time")

    if time_filter:
        if category:
            return jsonify(super_print('routes', category))
        else:
            return jsonify(super_print('routes'))
    elif category:
        return jsonify(super_print('routes', category))
    else:
        return jsonify(super_print('routes'))


# send category
@app.route('/category')
def category_return():
    return jsonify(super_print('category'))


# send image
@app.route('/image/<image_name>', methods=['GET'])
def send_image(image_name):
    image_path = os.path.join(app.root_path, 'images', image_name)
    if os.path.exists(image_path):
        return send_file(image_path, as_attachment=True)
    else:
        return "Файл не найден", 404


def toFluidObjectId(data, name):
    if data.get(name) and isinstance(data.get(name, [0])[0], str):
        data[name] = [ObjectId(category_id) for category_id in json.loads(data.get(name))]
    return data

# add something in collection
@app.route('/add', methods=['POST'])
@jwt_required()
def add_places():
    data = request.form.to_dict()
    print('request.files', request.files)
    if request.files.get("image", False):
        image = request.files['image']
        print('image', image)
        path = os.path.join(app.root_path, 'images', image.filename)
        image.save(path)
        print('image sace path', path)
        data['image'] = image.filename
        print('image.filename', image.filename)

    if data.get('walk', False):
        data['walk'] = data['walk'] == 'true'
    if data.get("_id"):
        del data['_id']

    # if data.get("category") and isinstance(data.get("category", [0])[0], str):
    #     data["category"] = [ObjectId(category_id) for category_id in json.loads(data.get("category"))]
    data = toFluidObjectId(data, "category")
    data = toFluidObjectId(data, "points")

    print('data', data)
    fill_collection(data['type'], data)
    return jsonify({"success": True}), 200


# get something by id
@app.route('/get_details_id', methods=['GET'])
def return_details_by_id():
    id = request.args.get('id')
    collection = request.args.get('table_name')

    details = get_place_details_id(id, collection)

    if details:
        return jsonify(details)
    else:
        return "Details not found"


# get something by name
@app.route('/get_details_name', methods=['GET'])
def return_place_by_name():
    id = request.args.get('id')
    collection = request.args.get('table_name')

    details = get_place_details_name(id, collection)

    if details:
        return jsonify(details)
    else:
        return "Place not found"


# delete something
@app.route('/delete', methods=['GET'])
@jwt_required()
def delete_by_id():
    id = request.args.get('id')
    collection = request.args.get('table_name')
    delete_place(id, collection)
    return jsonify({'success': True})


# edit something
@app.route('/edit', methods=['POST'])
@jwt_required()
def edit_by_id():
    data = request.form.to_dict()
    if request.files.get("image", False):
        image = request.files['image']
        path = os.path.join(app.root_path, 'images', image.filename)
        image.save(path)
        data['image'] = image.filename

    print('get data for edit', data.get("type", None))
    type_collection = data.get("type")
    id_obj = data.get("_id")
    del data['type']
    del data['_id']
    data = toFluidObjectId(data, "category")
    data = toFluidObjectId(data, "points")
    print('data edit',data)
    edit_collection(type_collection, data, id_obj)
    return jsonify({'success': True})


# start code
if __name__ == "__main__":
    collections = ['places', 'routes', 'category', 'accounts']
    app.run(host="0.0.0.0")
