from sqlite3 import Error
# pip install psycopg2
import psycopg2

USER = "postgres"
PASSWORD = "postgres"
HOST = "localhost"
PORT = "5432"

def get_connection():
    try:
        connection = psycopg2.connect(
            user=USER,
            password=PASSWORD,
            host=HOST,
            port=PORT
        )
        return connection
    except Error:
        print(Error)
def create_noutbuk_table(conn):
    cursor_object = conn.cursor()
    cursor_object.execute(
        """
            CREATE TABLE IF NOT EXISTS noutbuks_noutbuk
            (
                id serial PRIMARY KEY, 
                link text,
                nalichiye text,     
                description text,
                img text,
                price integer 
            )
        """
    )
    conn.commit()
def get_items(conn, price_from=0, price_to=100000):
    cursor = conn.cursor()
    cursor.execute(f'SELECT * FROM noutbuks_noutbuk WHERE price >= {price_from} and price <= {price_to}')
    return cursor.fetchall()
def insertconn(conn, link, nalichiye, description, img, price):
    cursor = conn.cursor()
    cursor.execute(f"INSERT INTO noutbuks_noutbuk (link, nalichiye, description, img, price) VALUES ('{link}', '{nalichiye}', '{description}','{img}', {float(price)})")
    conn.commit()
def run_test():
    conn = get_connection()
    create_noutbuk_table(conn)
    items = get_items(conn, price_from=10, price_to=30)
    for item in items:
        print(item)
    conn.close()

run_test()
