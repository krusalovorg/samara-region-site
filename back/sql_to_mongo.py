import pymysql
from pymongo import MongoClient
import config
import main
from bson import ObjectId


def sql_mongo(databases):
    # Подключение к MySQL
    connection = pymysql.connect(
        host=config.host,
        port=3306,
        user=config.user,
        password='misha.228',
        database='mydb',
        cursorclass=pymysql.cursors.DictCursor)

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
                    # Создаем ObjectId

                    del row['id']
                    data = main.toFluidObjectId(row, "points")
                    # Вставляем данные в MongoDB
                    main.fill_collection(table_name, data)

    connection.close()
    mongo_client.close()

sql_mongo(['category','routes'])