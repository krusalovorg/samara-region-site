import pymysql
import csv
from config import host, user, password, db_name

# Подключение к базе данных
connection = pymysql.connect(
    host=host,
    port=3306,
    user=user,
    password=password,
    database=db_name,
    cursorclass=pymysql.cursors.DictCursor)

cursor = connection.cursor()

# Список таблиц для экспорта
tables = ['places', 'routes', 'category']

# Цикл для экспорта каждой таблицы
for table in tables:
    # Выполнение SQL-запроса для выборки данных из таблицы
    sql_query = "SELECT * FROM {};".format(table)
    cursor.execute(sql_query)

    # Получение результатов запроса
    rows = cursor.fetchall()

    # Запись результатов в CSV-файл
    with open(f'{table}.csv'.format(table), 'w', newline='') as csvfile:
        csv_writer = csv.writer(csvfile)

        # Запись заголовков
        csv_writer.writerow([i[0] for i in cursor.description])

        # Запись данных
        for row in rows:
            print(row)
            csv_writer.writerow(row)

# Закрытие соединения
connection.close()