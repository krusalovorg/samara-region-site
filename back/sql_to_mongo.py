import pymysql
from pymongo import MongoClient
import config
import main
from bson import ObjectId


def create_connection():
    connection = pymysql.connect(
        host=config.host,
        port=3306,
        user=config.user,
        password='misha.228',
        database='mydb',
        cursorclass=pymysql.cursors.DictCursor)
    return connection


def sql_mongo(databases):
    # Подключение к MySQL
    connection = create_connection()
    # Подключение к MongoDB
    mongo_client = MongoClient("mongodb://localhost:27017")
    mongo_db = mongo_client['samara_region_site']

    for table_name in databases:
        # Получение данных из MySQL и перенос в MongoDB
        with connection.cursor() as cursor:
            # Извлекаем данные из указанной таблицы
            sql_query = f"SELECT * FROM {table_name}"
            cursor.execute(sql_query)
            result = cursor.fetchall()

            # Проходим по результатам и добавляем их в MongoDB
            for row in result:
                # Удаление старого id и сохранение old_id
                row['old_id'] = row['id']
                del row['id']

                # Добавление данных в MongoDB
                if table_name == "category":
                    # Добавляем категории в MongoDB
                    main.fill_collection(table_name, row)
                elif table_name == "places":
                    categories = row['category'].split(',')
                    category_list = []

                    for category_id in categories:
                        try:
                            int(category_id)
                            category = mongo_db['category'].find_one({'old_id': int(category_id)})
                            category_list.append(category['_id'])
                            row['category'] = category_list
                        except ValueError:
                            print("Not a Digit")
                    main.fill_collection(table_name, row)
                elif table_name == "routes":
                    points = row['points'].split(',')
                    points_list = []
                    categories = row['category'].split(',')
                    category_list = []
                    for category_id in categories:
                        int(category_id)
                        category = mongo_db['category'].find_one({'old_id': int(category_id)})
                        category_list.append(category['_id'])
                        row['category'] = category_list
                    for points_id in points:
                        int(points_id)
                        category = mongo_db['places'].find_one({'old_id': int(points_id)})
                        points_list.append(category['_id'])
                        row['points'] = points_list
                    main.fill_collection(table_name, row)
    # Закрываем соединения и возвращаем успешное завершение
    connection.close()
    mongo_client.close()


# Вызываем функцию с указанием таблиц для обработки
sql_mongo(['category', 'places', 'routes'])
