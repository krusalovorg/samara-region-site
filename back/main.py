import pymysql
from config import host, user, password, db_name
from flask import Flask, jsonify, request, send_file
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
from flask_cors import CORS

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your_secret_key'
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
        create_table_query = "CREATE TABLE `places`(id int AUTO_INCREMENT," \
                             "name varchar(50)," \
                             "card_description varchar(2500)," \
                             "description varchar(2500)," \
                             "category varchar(50)," \
                             "images varchar(50)," \
                             "coordinates varchar(2500)," \
                             "rate int DEFAULT 0 ," \
                             "price int DEFAULT 0 ," \
                             "city varchar(50)," \
                             "location varchar(50)," \
                             "walk BOOLEAN," \
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
                             "points varchar(2500), " \
                             "PRIMARY KEY (id));"
        cursor.execute(create_table_query)
        print("Table created successfully")


# create category table
def create_table_category():
    with connection.cursor() as cursor:
        create_table_query = "CREATE TABLE `category`(id int AUTO_INCREMENT," \
                             "name varchar(50)," \
                             "card_description varchar(2500)," \
                             "description varchar(2500)," \
                             "PRIMARY KEY (id));"
        cursor.execute(create_table_query)
        print("Table created successfully")


# fill tablle
def fill_table(connection, table_name, data):
    with connection.cursor() as cursor:
        if table_name == 'places':
            insert_query = f"INSERT INTO {table_name} (name, card_description, description, category, images, coordinates, rate, price,city,location,walk,time) VALUES (%s, %s, %s, %s, %s, %s, %s, %s,%s, %s, %s, %s);"
        elif table_name == 'routes':
            insert_query = f"INSERT INTO {table_name} (name, card_description, description, category, images, points) VALUES ( %s, %s, %s, %s, %s, %s);"
        elif table_name == 'category':
            insert_query = f"INSERT INTO {table_name} (name, card_description, description) VALUES ( %s, %s, %s);"
        for row in data:
            cursor.execute(insert_query, row)
        connection.commit()


# show table
def super_print(table_name, category=None):
    with connection.cursor() as cursor:
        if category:
            select_all_rows = f"SELECT * FROM {table_name} WHERE category = '{category}'"
        else:
            select_all_rows = f"SELECT * FROM {table_name}"
        cursor.execute(select_all_rows)
        rows = cursor.fetchall()
        result = []
        for row in rows:
            result.append(row)
        return result


# delete something
def delete_place(id, table_name):
    with connection.cursor() as cursor:
        delete_query = f"DELETE FROM `{table_name}` WHERE id = {id};"
        cursor.execute(delete_query)
        connection.commit()


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


@app.route('/places')
def points_return():
    category = request.args.get('category')
    if category:
        return jsonify(super_print('places', category))
    else:
        return jsonify(super_print('places'))


@app.route('/routes')
def routes_return():
    return jsonify(super_print('routes'))


@app.route('/category')
def category_return():
    return jsonify(super_print('category'))


@app.route('/send_image/<image_name>', methods=['GET'])
def send_image(image_name):
    image_path = os.path.join(app.root_path, 'images', image_name)
    return send_file(image_path, as_attachment=True)

@app.route('/add', methods=['POST'])
@jwt_required()
def add_places():
    if 'image' not in request.files:
        return 'No image part in the request', 400

    image = request.files['image']
    image.save(os.path.join(app.root_path, 'images', image.filename))

    data = request.json
    fill_table(connection, 'places', data)
    return jsonify({"success": True}), 200


# start code
if __name__ == "__main__":
    #print(super_print('places'))
    app.run()
