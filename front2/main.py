import pymysql
from config import host, user, password, db_name

try:
    connection = pymysql.connect(
        host=host,
        port=3306,
        user=user,
        password=password,
        database=db_name,
        cursorclass=pymysql.cursors.DictCursor
    )
    print("successfully connected...")
    print("#" * 20)

    try:
        def create_table():
            with connection.cursor() as cursor:
                create_table_query = "CREATE TABLE `places`(id int AUTO_INCREMENT," \
                                     "name varchar(50)," \
                                     "card_description varchar(2500)," \
                                     "description varchar(2500)," \
                                     "category varchar(50)," \
                                     "images varchar(50)," \
                                     "coordinates int DEFAULT 0," \
                                     "rate int DEFAULT 0" \
                                     "price int DEFAULT 0,PRIMARY KEY (id));"
                cursor.execute(create_table_query)
                print("Table created successfully")


        def add_place(name, card_description, description, category, images, coordinates, price, rate):
            with connection.cursor() as cursor:
                insert_query = f"INSERT INTO `places` (name, card_description, description,category,images,coordinates,price,rate) VALUES ({name}, {card_description}, {description}, {category},{images},{coordinates},{price},{rate});"
                cursor.execute(insert_query)
                connection.commit()


        def super_print():
            with connection.cursor() as cursor:
                select_all_rows = "SELECT * FROM `places`"
                cursor.execute(select_all_rows)
                rows = cursor.fetchall()
                for row in rows:
                    print(row)
                print("#" * 20)


        def delete_place(id):
            with connection.cursor() as cursor:
                delete_query = f"DELETE FROM `places` WHERE id = {id};"
                cursor.execute(delete_query)
                connection.commit()


        add_place('Гарибальди', 'крутое место', 'очень крутое место', 'замки', 'garibaldi', 11221, 12000, 5)
        super_print()
    finally:
        connection.close()

except Exception as ex:
    print("Connection refused...")
    print(ex)
