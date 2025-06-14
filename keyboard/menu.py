from aiogram.types import (InlineKeyboardMarkup,
                           InlineKeyboardButton, )


def goToMenu(text):

    #
    yes = InlineKeyboardButton(
        text=text,
        callback_data=f'go:menu'
    )

    row = [yes]
    rows = [row]
    return InlineKeyboardMarkup(inline_keyboard=rows)



def menuBtn():
    one = [InlineKeyboardButton(
    text="ЧТО Я ПОЛУЧУ ?",
    callback_data='go:menus'
    )]
    two =[ InlineKeyboardButton(
    text="Купить расклад",
    callback_data='go:menu:buy'
    )]
    three  = [ InlineKeyboardButton(
    text="Наши соц. сети",
    callback_data='links'
    )]


    row = [one, two, three]

    return InlineKeyboardMarkup(inline_keyboard=row)

def menuMainBtn():
    one = [InlineKeyboardButton(
        text="ASTERICA Жизни",
        callback_data='go:menus'
    )]
    two = [InlineKeyboardButton(
        text="ASTERICA Отношений",
        callback_data='go:menu:main'
    )]
    three = [InlineKeyboardButton(

        text="ASTERICA 2025",
        callback_data='go:menu:main'
    )]
    four = [InlineKeyboardButton(

        text="НАЗАД",
        callback_data='go:menu'
    )]

    row = [one, two, three, four]

    return InlineKeyboardMarkup(inline_keyboard=row)