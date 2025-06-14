from aiogram.types import CallbackQuery
from aiogram import Router, F
from aiogram.types import CallbackQuery

from create_bot import bot
from config import MAIN_TEXT, MAIN_MENU_TEXT, SUBSCRIBE_TEXT
from keyboard.menu import menuBtn, menuMainBtn, goToMenu
router = Router()


@router.callback_query(F.data == 'go:menu' )
async def userMenu(callback_query: CallbackQuery):

    data = callback_query.data
    print(data)
    user_status = await bot.get_chat_member(
        chat_id="-1002447410806", user_id=callback_query.from_user.id)
    if dict(user_status)['status'] == 'left':
        await bot.edit_message_text(chat_id=callback_query.from_user.id, message_id=callback_query.message.message_id,
                                    text=SUBSCRIBE_TEXT)
        await bot.edit_message_reply_markup(chat_id=callback_query.from_user.id,
                                            message_id=callback_query.message.message_id, reply_markup=goToMenu('Проверить подписку'))
    else:
        await bot.edit_message_text(chat_id=callback_query.from_user.id, message_id=callback_query.message.message_id, text=MAIN_TEXT)
        await bot.edit_message_reply_markup(chat_id=callback_query.from_user.id, message_id=callback_query.message.message_id, reply_markup=menuBtn())
    print(data)

# @router.callback_query(F.data[3:7] == 'menu' )
# async def userMainMenu(callback_query: CallbackQuery):
#     data = callback_query.data
#     print(data)
#     if callback_query.data.__contains__('main'):
#         await bot.edit_message_text(chat_id=callback_query.from_user.id, message_id=callback_query.message.message_id,
#                                     text=MAIN_MENU_TEXT)
#         await bot.edit_message_reply_markup(chat_id=callback_query.from_user.id,
#                                             message_id=callback_query.message.message_id, reply_markup=menuMainBtn())