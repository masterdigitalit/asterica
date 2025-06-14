from typing import Union
from db.main import getAdminsId
from aiogram import Router, F, types
from aiogram.types import CallbackQuery


from create_bot import bot
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import StatesGroup, State
from aiogram.filters import BaseFilter
from aiogram.types import Message


class ChatTypeFilter(BaseFilter):  # [1]
    def __init__(self, user_id: Union[str, list]): # [2]
        self.user_id = user_id

    async def __call__(self, message: Message) -> bool:  # [3]
        if isinstance(self.user_id, str):
            return message.from_user.id == self.user_id
        else:
            return message.from_user.id in self.user_id


class getVid(StatesGroup):
    video = State()



router = Router()


# ,ChatTypeFilter=['bot']

@router.message(Command("starts"), ChatTypeFilter(getAdminsId()))

async def adminStart(message: types.Message, state:FSMContext):

    data = message
    print(message.chat.type)
    await bot.send_message(message.from_user.id, 'jdfjdfjdfjjfjdfjdjfjdfjf')
    # await state.set_state(getVid.video)

#
# @router.message(getVid.video)
# async def getVideo(message: Message,  state: FSMContext):
#
#     if str(message.content_type)[12:] == 'VIDEO':
#         file_id = message.video.file_id  # Get file id
#         file = await bot.get_file(file_id)  # Get file path
#         await bot.download_file(file.file_path, "video.mp4")
#
#
#         await state.update_data(comment=file)
#
#         data = await state.get_data()
#        # addNewProject(name=data['name'], periodic=data['pereodic'], pereodic_time=data['pereodicTime'], daily=data['daily'], link=data['link'])
#         print(data)
#
#         await bot.send_message(message.from_user.id, 'успешно добавлено')
#     else:
#         await bot.send_message(message.from_user.id, 'неверный формат')
#         await state.set_state(getVid.video)