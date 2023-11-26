import pymysql
from config import host, user, password, db_name
from flask import Flask, jsonify

app = Flask(__name__)

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
def super_print(table_name):
    with connection.cursor() as cursor:
        select_all_rows = f"SELECT * FROM `{table_name}`"
        cursor.execute(select_all_rows)
        rows = cursor.fetchall()
        for row in rows:
            print(row)
        print("#" * 20)


# delete something
def delete_place(id, table_name):
    with connection.cursor() as cursor:
        delete_query = f"DELETE FROM `{table_name}` WHERE id = {id};"
        cursor.execute(delete_query)
        connection.commit()


@app.route('/')
def points_return():
    return jsonify(super_print('places'), super_print('routes'), super_print('category'))


# start code
if __name__ == "__main__":
    app.run()
