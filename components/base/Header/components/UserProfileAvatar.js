import {
	Avatar,
	IconButton,
	Menu,
	MenuItem,
	Typography,
	Box,
} from '@mui/material'
import { memo, useEffect, useState } from 'react'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import useAuthStore from 'lib/store/AuthStore.ts'
import { useRouter } from 'next/router'
import PersonIcon from '@mui/icons-material/Person'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import LogoutIcon from '@mui/icons-material/Logout'
import UserAvatar from 'components/base/UserAvatar'
import { useTranslations } from 'next-intl'

function UserProfile() {
	const t = useTranslations('header')
	const [anchorElUser, setAnchorElUser] = useState(undefined)
	const [registerOpenModal, setRegisterOpenModal] = useState(false)
	const [loginOpenModal, setLoginOpenModal] = useState(false)
	const [settings, setSettings] = useState([])
	const router = useRouter({
		isReady: true,
	})
	const { logout, user, session } = useAuthStore(state => state)
	useEffect(() => {
		if (user) {
			setSettings([
				{
					icon: <LogoutIcon />,
					name: t('logout'),
					onClick: () => {
						logout()
						router.push('/editor')
					},
				},
				{
					icon: <PersonIcon />,
					name: t('profile'),
					onClick: () => router.push(`/profile/${user?.username}`),
				},
			])
		} else {
			setSettings([
				{
					icon: <LoginIcon />,
					name: t('login'),
					onClick: () => loginHandleModal(true),
				},
				{
					icon: <PersonAddIcon />,
					name: t('register'),
					onClick: () => registerHandleModal(true),
				},
			])
		}
	}, [logout, router, user, session, t])

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
				<UserAvatar
					src={user?.avatar_url}
					username={user?.username}
					size={50}
				/>
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
						{setting.icon}
						<Typography
							textAlign='center'
							sx={{
								marginLeft: 1,
							}}>
							{setting.name}
						</Typography>
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
