import MySQLdb


def connection():
    conn = MySQLdb.connect(host="hostname",
                           user="username",
                           passwd="database password",
                           db="database_name")
    c = conn.cursor()

return c, conn
