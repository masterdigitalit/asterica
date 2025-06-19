import os

from create_bot import bot
from aiogram.types import FSInputFile

async def sendVideoToUser(name, id):
    print(name)
    await bot.send_video_note(id, FSInputFile(f"./timeMedia/{name}"))
    os.remove(f"./timeMedia/{name}")
