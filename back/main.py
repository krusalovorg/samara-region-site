import pymysql
import requests
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
                             "points varchar(2500), " \
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
            insert_query = "INSERT INTO places (name, card_description, description, category, images, coordinates, rate, price, city, location, walk, time) VALUES (%(name)s, %(cardDescription)s, %(description)s, %(category)s, %(image)s, %(coordinates)s, %(rate)s, %(price)s, %(city)s, %(location)s, %(walk)s, %(time)s);"
        elif table_name == 'routes':
            insert_query = f"INSERT INTO routes (name, card_description, description, category, images, points) VALUES ( %(name)s, %(cardDescription)s, %(description)s, %(category)s, %(image)s, %(points)s);"
        elif table_name == 'category':
            insert_query = f"INSERT INTO category (name, description) VALUES ( %(name)s, %(description)s);"
        print(data)
        cursor.execute(insert_query, data)
        connection.commit()
        print('знаечние добавлено в таблицу')


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


# delete something from table
def delete_place(id, table_name):
    with connection.cursor() as cursor:
        delete_query = f"DELETE FROM `{table_name}` WHERE id = {id};"
        cursor.execute(delete_query)
        connection.commit()

#edit something from table
def edit_table(table_name, options, values, id):
    for i in range(len(options)):
        edit_query = f"UPDATE {table_name} SET {options[i]} = '{values[i]}' WHERE id = {id};"
        cursor.execute(edit_query)
        connection.commit()

#get something from table by id
def get_place_details_id(place_id, table_name):
    with connection.cursor() as cursor:
        select_query = f"SELECT * FROM {table_name} WHERE id = %s"
        cursor.execute(select_query, (place_id,))
        place_details = cursor.fetchone()
        return place_details

#get something from table by name
def get_place_details_name(place_name, table_name):
    with connection.cursor() as cursor:
        select_query = f"SELECT * FROM {table_name} WHERE name = %s"
        cursor.execute(select_query, (place_name,))
        place_details = cursor.fetchone()
        return place_details

#login as admin
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

#return places
@app.route('/places')
def points_return():
    category = request.args.get('category')
    if category:
        return jsonify(super_print('places', category))
    else:
        return jsonify(super_print('places'))

#send routes
@app.route('/routes')
def routes_return():
    return jsonify(super_print('routes'))

#send category
@app.route('/category')
def category_return():
    return jsonify(super_print('category'))

#send image
@app.route('/image/<image_name>', methods=['GET'])
def send_image(image_name):
    image_path = os.path.join(app.root_path, 'images', image_name)
    return send_file(image_path, as_attachment=True)

#add something in table
@app.route('/add', methods=['POST'])
# @jwt_required()
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

#get somethin by id
@app.route('/get_details_id', methods=['GET'])
def return_details_by_id():
    id = request.args.get('id')
    table = request.args.get('table_name')

    if table == 'places':
        details = get_place_details_id(id, 'places')
    elif table == 'routes':
        details = get_place_details_id(id, 'routes')
    elif table == 'category':
        details = get_place_details_id(id, 'category')
    else:
        return "table not found"

    if details:
        return jsonify(details)
    else:
        return "Details not found"

#get something by name
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

#delete something
@app.route('/delete', methods=['GET'])
def delete_by_id():
    id = request.args.get('id')
    table = request.args.get('table_name')
    delete_place(id, table)

#edit something
@app.route('/edit', methods=['GET'])
def edit_by_id():
    id = request.args.get('id')
    table = request.args.get('table_name')
    options = request.args.get('options')
    values = request.args.get('values')
    edit_table(table, options, values, id)


# start code
if __name__ == "__main__":
    tables = ['places', 'routes', 'category']
    #data = ("Example Place", "Short description", "Long description", "1,2", "example.jpg", "12.3456, -78.9101", 5, 100, "Example City", "Example Location", True, 60)
    #fill_table(connection,'places',data)
    #print(super_print('places'))
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

    print(super_print('places'))
    app.run()
