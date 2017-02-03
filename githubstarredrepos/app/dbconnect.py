import MySQLdb
from config import database

def connection():
    conn = MySQLdb.connect(host = database["hostname"],
                           user = database["username"],
                           passwd = database["database password"],
                           db = database["database_name"])
    c = conn.cursor()
    return c, conn
