import {
	Avatar,
	IconButton,
	Menu,
	MenuItem,
	Typography,
	Box,
} from '@mui/material'
import React, { memo, useEffect, useState } from 'react'
import LoginModal from './modals/LoginModal'
import RegisterModal from './modals/RegisterModal'
import store from '../../lib/store/AuthStore.ts'
import create from 'zustand'
import { useRouter } from 'next/router'

import { useUser } from '@supabase/auth-helpers-react'
import { supabaseClient } from '@supabase/auth-helpers-nextjs'

function UserProfile() {
	const [anchorElUser, setAnchorElUser] = useState(undefined)
	const [registerOpenModal, setRegisterOpenModal] = useState(false)
	const [loginOpenModal, setLoginOpenModal] = useState(false)
	const [settings, setSettings] = useState([])
	const router = useRouter()
	const { logout, currentUserData, user } = create(store)()

	useEffect(() => {
		if (user) {
			setSettings([
				{
					name: 'Logout',
					onClick: () => logout(),
				},
				{
					name: 'Profile',
					onClick: () => router.push('/profile'),
				},
			])
		} else {
			setSettings([
				{
					name: 'Login',
					onClick: () => loginHandleModal(true),
				},
				{
					name: 'Register',
					onClick: () => registerHandleModal(true),
				},
			])
		}
	}, [logout, router, user])

	const handleCloseUserMenu = () => {
		setAnchorElUser(null)
	}
	const handleOpenUserMenu = event => {
		setAnchorElUser(event.currentTarget)
	}

	const registerHandleModal = state => {
		setRegisterOpenModal(state)
	}
	const loginHandleModal = state => {
		setLoginOpenModal(state)
	}

	return (
		<Box sx={{ flexGrow: 0 }}>
			<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
				{currentUserData?.username.length > 0 ? (
					<Avatar alt={currentUserData?.username}>
						{currentUserData?.username.charAt(0).toUpperCase()}
					</Avatar>
				) : (
					<Avatar />
				)}
			</IconButton>
			<Menu
				sx={{ mt: '45px' }}
				id='menu-appbar'
				anchorEl={anchorElUser}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				keepMounted
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				open={Boolean(anchorElUser)}
				onClose={handleCloseUserMenu}>
				{settings.map((setting, index) => (
					<MenuItem
						key={index}
						onClick={() => {
							setting.onClick()
							handleCloseUserMenu()
						}}>
						<Typography textAlign='center'>{setting.name}</Typography>
					</MenuItem>
				))}
			</Menu>
			<RegisterModal
				open={registerOpenModal}
				handleModal={registerHandleModal}
			/>
			<LoginModal open={loginOpenModal} handleModal={loginHandleModal} />
		</Box>
	)
}

export default memo(UserProfile)
