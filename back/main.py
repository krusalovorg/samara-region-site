from datetime import timedelta

import pymysql
import requests
from config import host, user, password, db_name
from flask import Flask, jsonify, request, send_file, Response
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
from flask_cors import CORS

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your_secret_key'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
jwt = JWTManager(app)

CORS(app)

# connect to host
connection = pymysql.connect(
    host=host,
    port=3306,
    user=user,
    password=password,
    database=db_name,
    cursorclass=pymysql.cursors.DictCursor)


# create table with points
def create_table_points():
    with connection.cursor() as cursor:
        create_table_query = "CREATE TABLE places(id int AUTO_INCREMENT," \
                             "name varchar(50) DEFAULT ''," \
                             "card_description varchar(2500) DEFAULT ''," \
                             "description varchar(2500) DEFAULT ''," \
                             "category varchar(50) DEFAULT ''," \
                             "images varchar(50) DEFAULT ''," \
                             "coordinates varchar(2500) DEFAULT ''," \
                             "rate int DEFAULT 0 ," \
                             "price int DEFAULT 0 ," \
                             "city varchar(50) DEFAULT ''," \
                             "location varchar(50) DEFAULT ''," \
                             "walk BOOLEAN DEFAULT FALSE," \
                             "time int DEFAULT 0," \
                             "PRIMARY KEY (id));"
        cursor.execute(create_table_query)
        print("Table created successfully")


# create table with routes
def create_table_routes():
    with connection.cursor() as cursor:
        create_table_query = "CREATE TABLE `routes`(id int AUTO_INCREMENT," \
                             "name varchar(50)," \
                             "card_description varchar(2500)," \
                             "description varchar(2500)," \
                             "category varchar(50)," \
                             "images varchar(50)," \
                             "points varchar(2500)," \
                             "time int DEFAULT 0, " \
                             "PRIMARY KEY (id));"
        cursor.execute(create_table_query)
        print("Table created successfully")


# create category table
def create_table_category():
    with connection.cursor() as cursor:
        create_table_query = "CREATE TABLE `category`(id int AUTO_INCREMENT," \
                             "name varchar(50)," \
                             "description varchar(2500)," \
                             "PRIMARY KEY (id));"
        cursor.execute(create_table_query)
        print("Table created successfully")


# fill tablle
def fill_table(connection, table_name, data):
    with connection.cursor() as cursor:
        if table_name == 'places':
            insert_query = "INSERT INTO places (name, card_description, description, category, images, coordinates, rate, price, city, location, walk, time) VALUES (%(name)s, %(card_description)s, %(description)s, %(category)s, %(image)s, %(coordinates)s, %(rate)s, %(price)s, %(city)s, %(location)s, %(walk)s, %(time)s);"
        elif table_name == 'routes':
            insert_query = f"INSERT INTO routes (name, card_description, description, category, images, points) VALUES ( %(name)s, %(card_description)s, %(description)s, %(category)s, %(image)s, %(points)s);"
        elif table_name == 'category':
            insert_query = f"INSERT INTO category (name, description) VALUES ( %(name)s, %(description)s);"
        print(data)
        cursor.execute(insert_query, data)
        connection.commit()
        print('знаечние добавлено в таблицу')


def create_connection():
    return pymysql.connect(
        host=host,
        port=3306,
        user=user,
        password=password,
        database=db_name,
        cursorclass=pymysql.cursors.DictCursor)


# show table
def super_print(table_name, category=None):
    # connection.ping()  # reconnecting mysql
    new_connection = create_connection()
    with new_connection.cursor() as cursor:
        if category and int(category) > -1:
            select_all_rows = f"SELECT * FROM {table_name} WHERE category LIKE '%{category}%'"
            print(select_all_rows)
        else:
            select_all_rows = f"SELECT * FROM {table_name}"
        cursor.execute(select_all_rows)
        rows = cursor.fetchall()
        result = []
        for row in rows:
            result.append(row)
        return result


# delete something from table
def delete_place(id, table_name):
    connection = create_connection()
    with connection.cursor() as cursor:
        delete_query = f"DELETE FROM {table_name} WHERE id = {id};"
        print(delete_query)
        cursor.execute(delete_query)
        connection.commit()
        print('delete',super_print('category'))
    return Response(status=200)


# edit something from table
def edit_table(table_name, changes, id):
    for key, value in changes.items():
        edit_query = f"UPDATE {table_name} SET {key} = '{value}' WHERE id = {id};"
        print(edit_query)
        cursor.execute(edit_query)
        connection.commit()


# get something from table by id
def get_place_details_id(place_id, table_name):
    connection = create_connection()
    with connection.cursor() as cursor:
        select_query = f"SELECT * FROM {table_name} WHERE id = %s"
        print(select_query.replace('%s', place_id))
        cursor.execute(select_query, (place_id))
        place_details = cursor.fetchone()
        return place_details


# get something from table by name
def get_place_details_name(place_name, table_name):
    with connection.cursor() as cursor:
        select_query = f"SELECT * FROM {table_name} WHERE name = %s"
        cursor.execute(select_query, (place_name))
        place_details = cursor.fetchone()
        return place_details


def get_routes_filtred(time_filter, category_filter):
    connection = create_connection()
    with connection.cursor() as cursor:
        if int(category_filter) == -1:
            query = f"SELECT * FROM routes WHERE time <= {time_filter} ORDER BY time DESC"
            print("search only by time", query)
        else:
            query = f"SELECT * FROM routes WHERE time <= {time_filter} AND category LIKE '%{category_filter}%' ORDER BY time DESC"
        cursor.execute(query)
        rows = cursor.fetchall()
        result = []
        for row in rows:
            result.append(row)
        return result

def get_objects_arr(arr, table_name):
    category_ids = arr.split(",")
    result = []
    for category_id in category_ids:
        category_details = get_place_details_id(category_id, table_name)
        result.append(category_details)
    return result

def get_full_object(route_id, table_name):
    object_details = get_place_details_id(route_id, table_name)
    print('get place route',object_details)
    object_details['category'] = get_objects_arr(object_details["category"], 'category')

    if table_name == 'routes':
        object_details['points'] = get_objects_arr(object_details["points"], 'places')

    return object_details


def get_arr_full_object(routes, table_name):
    for index, item in enumerate(routes):
        object_details = get_full_object(str(item.get('id')), table_name)
        routes[index] = object_details
    return routes


# login as admin
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    passworded = request.json.get('password')

    if username == 'user' and passworded == 'password':
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
        return jsonify(get_arr_full_object(super_print('places', category), 'places'))
    else:
        return jsonify(get_arr_full_object(super_print('places'), 'places'))


# send routes
@app.route('/routes')
def routes_return():
    category = request.args.get('category')
    time = request.args.get("time")

    if time:
        if category:
            return jsonify(get_arr_full_object(get_routes_filtred(time, category), 'routes'))
        else:
            return jsonify(get_arr_full_object(get_routes_filtred(time, -1), 'routes'))
    elif category:
        return jsonify(get_arr_full_object(super_print('routes', category), 'routes'))
    else:
        return jsonify(get_arr_full_object(super_print('routes'), 'routes'))


# send category
@app.route('/category')
def category_return():
    return jsonify(super_print('category'))


# send image
@app.route('/image/<image_name>', methods=['GET'])
def send_image(image_name):
    image_path = os.path.join(app.root_path, 'images', image_name)
    return send_file(image_path, as_attachment=True)


# add something in table
@app.route('/add', methods=['POST'])
@jwt_required()
def add_places():
    data = request.form.to_dict()
    if request.files.get("image", False):
        image = request.files['image']

        print('image', image)
        path = os.path.join(app.root_path, 'images', image.filename)
        image.save(path)
        data['image'] = image.filename

    if data.get('walk', False):
        data['walk'] = data['walk'] == 'true'
    print('data', data)

    fill_table(connection, data.get("type"), data)
    return jsonify({"success": True}), 200


# get somethin by id
@app.route('/get_details_id', methods=['GET'])
def return_details_by_id():
    id = request.args.get('id')
    table = request.args.get('table_name')

    if table == 'places':
        details = get_full_object(id, 'places')
    elif table == 'routes':
        details = get_full_object(id, 'routes')
    elif table == 'category':
        details = get_place_details_id(id, 'category')
    else:
        return "table not found"

    if details:
        return jsonify(details)
    else:
        return "Details not found"


# get something by name
@app.route('/get_details_name', methods=['GET'])
def return_place_by_name():
    id = request.args.get('id')
    table = request.args.get('table_name')

    if table == 'place':
        details = get_place_details_name(id, 'places')
    elif table == 'routes':
        details = get_place_details_name(id, 'routes')

    else:
        return "table bot found"

    if details:
        return jsonify(details)
    else:
        return "Place not found"


# delete something
@app.route('/delete', methods=['GET'])
@jwt_required()
def delete_by_id():
    id = request.args.get('id')
    table = request.args.get('table_name')
    delete_place(id, table)
    return jsonify({'success': True})

# edit something
@app.route('/edit', methods=['POST'])
@jwt_required()
def edit_by_id():
    data = request.form.to_dict()
    if request.files.get("image", False):
        image = request.files['image']

        print('image', image)
        path = os.path.join(app.root_path, 'images', image.filename)
        image.save(path)
        data['image'] = image.filename
    print('get data for edit',data.get("type", None))
    type_table = data.get("type")
    id_obj = data.get("id")
    del data['type']
    del data['id']
    edit_table(type_table, data, id_obj)
    return jsonify({'success': True})

# start code
if __name__ == "__main__":
    tables = ['places', 'routes', 'category']
    for table in tables:
        cursor = connection.cursor()
        cursor.execute("SHOW TABLES LIKE %s", (table,))
        result = cursor.fetchone()
        if not result:
            if table == 'places':
                create_table_points()
            elif table == 'routes':
                create_table_routes()
            elif table == 'category':
                create_table_category()


    app.run(host="0.0.0.0")
