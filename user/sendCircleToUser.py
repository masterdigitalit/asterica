from create_bot import bot
from aiogram.types import FSInputFile

async def sendVideoToUser(name):
    print(name)
    await bot.send_video_note(5273914742, FSInputFile(f"../timeMedia/{name}"))
