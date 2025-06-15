import React from 'react'
import { Link } from 'react-router-dom'
import style from '../styles/Navigation.module.scss'

export default function Navigation() {
	return (
		<div className={style.header}>
			<Link to={'/'}>Заказы</Link>
		</div>
	)
}
