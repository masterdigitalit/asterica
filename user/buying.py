from aiogram import Router, F
from aiogram.types import CallbackQuery
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import StatesGroup, State
from aiogram.types import CallbackQuery
from aiogram.types import Message
from aiogram.types import ReplyKeyboardRemove
from admin.newOrder import sendCreatorTask
from create_bot import bot
from utils import  linkGenegratorFun
from db.main import  addNewOrder

router = Router()

class buyLayout(StatesGroup):
    name = State()
    date_of_birth = State()
    comment = State()

@router.callback_query(F.data == 'go:menu:buy')
async def buyLayoutFun(callback_query: CallbackQuery, state:FSMContext):

    await bot.delete_message(callback_query.from_user.id, message_id=callback_query.message.message_id)
    await state.set_state(buyLayout.name)
    await bot.send_message(callback_query.from_user.id, 'Введите ваше имя', reply_markup=ReplyKeyboardRemove())
@router.message(buyLayout.name)
async def adminAddProjectName(message:Message,  state:FSMContext):

    await state.update_data(name=message.text)
    await state.set_state(buyLayout.date_of_birth)
    await bot.send_message(message.from_user.id, 'Дата рождения в формате 20.04.2005')

@router.message(buyLayout.date_of_birth)
async def adminAddProjectPereodic(message:Message,  state:FSMContext):

    await state.update_data(date_of_birth=message.text)
    await state.set_state(buyLayout.comment)
    await bot.send_message(message.from_user.id, 'Комментарий к запросу', reply_markup=ReplyKeyboardRemove())
@router.message(buyLayout.comment)
async def adminAddProjectPereodicTime(message:Message,  state:FSMContext):

    await state.update_data(comment=message.text)
    data = await state.get_data()
    print(data)
    link = linkGenegratorFun()
    addNewOrder(name=data['name'], age=data['date_of_birth'], comment=data['comment'], telegramId=message.from_user.id, link=link)
    print(message.from_user.username)
    await sendCreatorTask(data, message.from_user.username, link=link)
    await state.clear()
    await bot.send_message(message.from_user.id, 'успешно добавлено', reply_markup=ReplyKeyboardRemove())











