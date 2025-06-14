from create_bot import bot
from db.main import getAdminsId
async def sendCreatorTask( text, userName, link):

    await bot.send_message(getAdminsId()[0], f"""Имя: <code>{str(text['name'])}</code>\nUserName: { "@"+str(userName)}\nДата рождения: <code>{str(text['date_of_birth'])}</code>\nКомментарий: <code>{str(text['comment'])}</code>\nСсылка: http://192.168.1.2:3000/page/{link}""", parse_mode='HTML')