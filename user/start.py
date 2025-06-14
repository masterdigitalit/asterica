from aiogram import Router
from aiogram import types
from aiogram.filters import Command
from keyboard.menu import goToMenu
from create_bot import bot



router = Router()
@router.message(Command("start"))
async def startMessage(message: types.Message):
    chat_id = message.chat.id

    message_id = message.message_id
    user_id = message.from_user.id
    await bot.delete_message(chat_id, message.message_id)

    await bot.send_message(chat_id, """Вас приветствуют Елена и Ирина в нашем уникальном боте ASTERICA.

С нами вы откроете все тайны вашей будущей жизни!

Мы осветим ваш правильный путь и поможем увидеть Вас самих с удивительных и, возможно, новых сторон.

Если готовы приступить к путешествию в свою новую крутую жизнь, выберите одно из следующих направлений

Рекомендуем начать с «ASTERICA Жизни» и приступить к усилению себя!""", reply_markup=goToMenu('Приступить'))


