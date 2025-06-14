import sqlite3

con = sqlite3.connect("C:/Users/maksi/PycharmProjects/asterica/db/taro.db", detect_types=sqlite3.PARSE_DECLTYPES |
                                                  sqlite3.PARSE_COLNAMES, check_same_thread=False)

def createTable():
    cursor = con.cursor()
    # cursor.execute("""CREATE TABLE Users (id INTEGER, Status TEXT, dateCreated TEXT, isSubscribed TEXT, telegramId INTEGER) """)
    cursor.execute(
        """CREATE TABLE Orders ( telegramId INTEGER,  Name TEXT, Age TEXT, Comment TEXT ,Status TEXT, Link TEXT) """)
    cursor.close()

def getAdminsId():
    cursor = con.cursor()
    req = cursor.execute("""SELECT telegramId FROM Users WHERE status = "admin" """, ).fetchall()

    print(req)
    return req[0]
    cursor.close()
def addNewOrder(name, age, comment, telegramId, link):
    cursor = con.cursor()

    cursor.execute("INSERT INTO Orders (Name, Age, Comment,telegramId, Status, Link ) VALUES (?,?,?,?,?,?)",
                   [name, age, comment,telegramId, str(0), str(link) ])
    con.commit()
    cursor.close()
async def getOrder(link):
    cursor = con.cursor()
    req = cursor.execute("""SELECT * FROM Orders WHERE Link = ? """, [link]).fetchall()
    cursor.close()

    return req

async def getAllOrders():
    cursor = con.cursor()
    req = cursor.execute("""SELECT * FROM Orders """ ).fetchall()
    cursor.close()
    print(req)

    return req


# createTable()
# getAdminsId()
