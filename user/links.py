from aiogram.types import CallbackQuery
from aiogram import Router, F, types
from aiogram.types import CallbackQuery
from keyboard.menu import goToMenu

from create_bot import bot
from config import MAIN_TEXT, MAIN_MENU_TEXT, SUBSCRIBE_TEXT
from keyboard.menu import menuBtn, menuMainBtn, goToMenu
from aiogram.types import FSInputFile





router = Router()





@router.callback_query(F.data == 'links')
async def userMainMenu(callback_query: CallbackQuery):
    data = callback_query.data
    print(data)


    await bot.send_video_note(callback_query.from_user.id, FSInputFile("tests.mp4"))

