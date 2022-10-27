import React, { useEffect } from 'react'

interface LogoutButtonProps {
	elementId?: string
	href?: string
}

const LogoutButton = (props?: LogoutButtonProps) => {
	useEffect(() => {
		const { elementId = '__logto__logout', href = '/admin/signout' } = props || {}
		if (document.getElementById(elementId)) {
			return
		}
		const logout = document.querySelector('.nav__log-out')
		const newLogout = document.createElement('a')
		newLogout.id = elementId
		newLogout.setAttribute('class', logout.getAttribute('class'))
		newLogout.setAttribute('href', href)
		newLogout.innerHTML = logout.innerHTML
		logout.parentNode.insertBefore(newLogout, logout.nextSibling)
		logout.setAttribute('style', 'display:none')
	})

	return <React.Fragment></React.Fragment>
}

export default LogoutButton
