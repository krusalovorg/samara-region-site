import json
from datetime import timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId
from flask import Flask, jsonify, request, send_file, Response
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from pymongo import MongoClient
from config import host, user, password, db_name, password_admin
import os
import numpy as np
from sklearn.cluster import KMeans
import email_newsletter
import secrets
import time

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

codes = {}


def generate_reset_code(email):
    # Генерация уникального 6-значного кода
    code = secrets.randbelow(900000) + 100000

    # Получение текущей даты и времени
    current_time = time.time()

    # Запись кода и даты в словарь
    codes[email] = {"code": code, "date": current_time}
    print(codes[email])
    print(email_newsletter.send_email(email, str(codes[email]['code']), email_newsletter.reset_title))
    return code


def is_code_valid(email):
    if email in codes:
        # Проверка, прошло ли более 5 минут с момента генерации кода
        current_time = time.time()
        elapsed_time = current_time - codes[email]["date"]
        print(elapsed_time)
        if elapsed_time <= 300:  # 300 секунд = 5 минут
            return True
        else:
            # Удаление кода, если прошло более 5 минут
            del codes[email]
    return False


def fill_collection(collection, data):
    db[collection].insert_one(data)
    print('Data added to collection')


def serialize_object(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    raise TypeError(repr(obj) + " is not JSON serializable")


def super_print(collection_name, category=None):
    if category and category != -1 and isinstance(category, str) and len(category) > 5:
        query = {"category": {"$elemMatch": {"$eq": ObjectId(category)}}}
    else:
        query = {}
    print(query)

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
    # for components in serialized_result:
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
    print('place id get', place_id, collection_name)
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


def get_user_hash_password(email=None):
    if accounts.find_one({"email": email}):
        return accounts.find_one({"email": email})['password']


def get_full_user(email):
    if accounts.find_one({'email': email}):
        full_user = accounts.find_one({'email': email})
        del full_user['password']
        return full_user


def find_fav(email, fav):
    if fav == 'places':
        return accounts.find_one({"email": email})['fav_places']
    elif fav == 'routes':
        return accounts.find_one({"email": email})['fav_routes']


def get_user():
    if accounts.find_one({"email": get_jwt_identity()}):
        result = accounts.find_one({"email": get_jwt_identity()})
        result['_id'] = str(result['_id'])
        return result


# sign up
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    # Проверка наличия аккаунта с таким же email
    existing_account = db.accounts.find_one({"email": data['email']})
    if existing_account:
        return jsonify({'message': 'Account with this email already exists', 'status': False})
    # Хэширование пароля и сохранение данных в базе
    data['password'] = generate_password_hash(data['password'], method='pbkdf2:sha256')
    data['role'] = 'user'
    db.accounts.insert_one(data)
    email_newsletter.send_email(data['email'],
                                email_newsletter.register_text(db.accounts.find_one({"email": data['email']})['name']),
                                email_newsletter.register_title)
    return jsonify({'message': 'User registered successfully', 'status': True})


# log in
@app.route('/login_user', methods=['POST'])
def login_user():
    data = request.get_json()
    user_password = data['password']
    email = data['email']
    user = get_user_hash_password(email=email)
    print('password', user, user_password, check_password_hash(user, user_password))
    if user and check_password_hash(user, user_password):
        access_token = create_access_token(identity=email)
        email_newsletter.send_email(data['email'],
                                          email_newsletter.login_text(
                                              db.accounts.find_one({"email": data['email']})['name']),
                                          email_newsletter.login_title)
        return jsonify(access_token=access_token, status=True), 200
    else:
        return jsonify({'message': 'incorrect password'})


@app.route('/reset_code', methods=['POST'])
def reset_code():
    data = request.get_json()
    email = data['email']
    generate_reset_code(email)
    email_newsletter.send_email(data['email'],
                                email_newsletter.reset_text(db.accounts.find_one({"email": data['email']})['name'],
                                                            codes[email]['code']),
                                email_newsletter.reset_title)
    return 'код сгенерирован'


@app.route('/check_code', methods=['POST'])
def check_code():
    data = request.get_json()
    email = data['email']
    code = data['code']
    if is_code_valid(email) and int(code) == codes[email]['code']:
        changes = {"password": data['new_password']}
        db['accounts'].update_one({"email": email}, {"$set": changes})
        return 'Установлен новый пароль'
    else:
        return 'Код неверный или устарел'


@app.route('/add_favorite', methods=['POST'])
@jwt_required()
def add_favorite():
    data = request.get_json()
    email = get_jwt_identity()
    if not email:
        return jsonify({'message': 'User Email not found in JWT token', 'status': False}), 400
    print(data)
    item_id = None
    if data.get('place_id'):
        item_id = ObjectId(data['place_id'])
        result = db['accounts'].update_one({"email": email}, {"$addToSet": {"favorites.places": item_id}})
        if result.modified_count == 0:  # Если ничего не было изменено, удаляем элемент из избранных
            db['accounts'].update_one({"email": email}, {"$pull": {"favorites.places": item_id}})
        else:
            return jsonify({'status': True, 'action': 'added'})
    elif data.get('route_id') in data:
        item_id = ObjectId(data['route_id'])
        result = db['accounts'].update_one({"email": email}, {"$addToSet": {"favorites.routes": item_id}})
        if result.modified_count == 0:  # Если ничего не было изменено, удаляем элемент из избранных
            db['accounts'].update_one({"email": email}, {"$pull": {"favorites.routes": item_id}})
        else:
            return jsonify({'status': True, 'action': 'added'})
    else:
        return jsonify({'message': 'Invalid request, missing place_id or route_id', 'status': False}), 400
    return jsonify({'status': True, 'action': 'removed'})


@app.route('/get_all_places', methods=['GET'])
@jwt_required()
def get_all_places():
    email = get_jwt_identity()
    places_all = find_fav(email, 'places')
    return jsonify(places_all)


# Route to get all routes
@app.route('/get_all_routes', methods=['GET'])
@jwt_required()
def get_all_routes():
    email = get_jwt_identity()
    routes_all = find_fav(email, 'routes')
    return jsonify(routes_all)


@app.route('/get_full_user', methods=['GET'])
@jwt_required()
def full_user():
    email = get_jwt_identity()
    user_full = get_full_user(email)
    serialized_result = json.loads(json.dumps(user_full, default=serialize_object))
    return jsonify(serialized_result)


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


def isAdminUser():
    user = get_user()
    return user['role'] == 'admin'


# add something in collection
@app.route('/add', methods=['POST'])
@jwt_required()
def add_places():
    data = request.form.to_dict()

    if not isAdminUser():
        return jsonify({"success": False}), 400

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

    if data.get("points") and len(data.get("points")) == 0:
        del data['points']

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
    if not isAdminUser():
        return jsonify({"success": False}), 400

    id = request.args.get('id')
    collection = request.args.get('table_name')
    delete_place(id, collection)
    return jsonify({'success': True})


# edit something
@app.route('/edit', methods=['POST'])
@jwt_required()
def edit_by_id():
    if not isAdminUser():
        return jsonify({"success": False}), 400

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
    print('data edit', data)
    edit_collection(type_collection, data, id_obj)
    return jsonify({'success': True})


def addAdminUser():
    new_user_data = {
        "email": "admin@admin.admin",
        "name": "admin",
        "role": "admin",
        "favorites": {"places": [], "routes": []}
    }

    # Поиск пользователя по email
    existing_user = accounts.find_one({"email": new_user_data["email"]})

    if not existing_user:
        # Генерация хеша пароля
        hashed_password = generate_password_hash(password_admin, method='pbkdf2:sha256')
        new_user_data["password"] = hashed_password
        # Добавление пользователя в коллекцию
        accounts.insert_one(new_user_data)
        print("Пользователь успешно добавлен. Пароль:", password_admin)
    else:
        print("Пользователь уже существует в базе данных.")


def generateRoute():
    # Получаем точки из базы данных
    points_from_db = super_print('places')
    point_names = [point["name"] for point in points_from_db]
    coordinates = [(int(coord[0]), int(coord[1])) for coord in
                   [point["coordinates"].split(",") for point in points_from_db]]

    # Преобразуем координаты в массив NumPy
    points_array = np.array(coordinates)

    # Количество кластеров, в данном случае мы хотим найти 3 ближайшие точки
    n_clusters = 3

    # Выполняем кластеризацию с помощью KMeans
    kmeans = KMeans(n_clusters=n_clusters, random_state=0).fit(points_array)

    # Получаем метки кластеров для каждой точки
    cluster_labels = kmeans.predict(points_array)

    # Создаем словарь, где ключи - это метки кластеров, а значения - это названия точек
    cluster_points = {i: [] for i in range(n_clusters)}

    for i, point_name in enumerate(point_names):
        cluster_points[cluster_labels[i]].append((point_name, coordinates[i]))

    for cluster, points in cluster_points.items():
        cluster_center = kmeans.cluster_centers_[cluster]
        sorted_points = sorted(points, key=lambda x: np.linalg.norm(np.array(x[1]) - cluster_center))
        ordered_point_names = [point[0] for point in sorted_points]
        print(f"Cluster {cluster + 1} visit order: {', '.join(ordered_point_names)}")

    # for i, point_name in enumerate(point_names):
    #    cluster_points[cluster_labels[i]].append(point_name)
    #
    # Выводим точки, относящиеся к каждому кластеру
    # for cluster, point_list in cluster_points.items():
    #    print(f"Cluster {cluster + 1}: {', '.join(point_list)}")


# start code
if __name__ == "__main__":
    collections = ['places', 'routes', 'category', 'accounts']
    addAdminUser()
    app.run(host="0.0.0.0")
