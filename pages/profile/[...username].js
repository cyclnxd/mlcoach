import { useRouter } from 'next/router'
import useDataStore from 'lib/store/DataStore.ts'
import create from 'zustand'
import { useEffect, useState } from 'react'
import {
	Stack,
	Box,
	Avatar,
	Typography,
	IconButton,
	MenuList,
	MenuItem,
	ListItemIcon,
	ListItemText,
	Menu,
} from '@mui/material'
import Head from 'next/head'
import Loading from 'components/Loading'
import useAuthStore from 'lib/store/AuthStore.ts'
import SettingsIcon from '@mui/icons-material/Settings'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
function Profile() {
	const router = useRouter()
	const { username } = router.query
	const { getUserByUsername } = create(useDataStore)()

	const [user, setUser] = useState(null)
	const [error, setError] = useState('')
	const [title, setTitle] = useState('Loading...')
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function getUser() {
			setLoading(true)
			if (username) {
				setTitle(`MLCoach ${username}'s profile`)
				try {
					const data = await getUserByUsername(username)
					setUser(data)
					setError('')
				} catch (error) {
					setError(error.message)
					setUser(null)
					setTitle('Profile not found')
				} finally {
					setLoading(false)
				}
			}
		}
		getUser()
	}, [getUserByUsername, username])

	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			{loading ? (
				<Loading />
			) : error.length > 0 ? (
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						height: '100vh',
						width: '100vw',
					}}>
					<h1>User not found</h1>
				</Box>
			) : (
				<Stack
					spacing={2}
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'start',
						justifyContent: 'start',
						height: '100vh',
						width: '100vw',
						p: 1,
					}}>
					<UserProfile user={user} />
					<Box sx={{ display: 'flex', justifyContent: 'center' }}></Box>
					<Box sx={{ display: 'flex', justifyContent: 'center' }}>
						<h2>{user.email}</h2>
					</Box>
				</Stack>
			)}
		</>
	)
}

const UserProfile = ({ user }) => {
	const { session } = create(useAuthStore)()
	const [isOwner, setIsOwner] = useState(false)
	const [isFollowing, setIsFollowing] = useState(false)

	const handleFollow = () => {
		setIsFollowing(prev => !prev)
	}

	useEffect(() => {
		setIsOwner(session?.user?.id === user.id)
	}, [session?.user?.id, user])

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: { xs: 'column', md: 'row' },
				justifyContent: 'space-between',
				alignItems: 'center',
				width: '100%',
				p: 3,
				gap: { xs: 2, md: 4 },
				backgroundColor: 'primary.darkLight',
				borderRadius: 2,
			}}>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					gap: 2,
				}}>
				{user?.username.length > 0 ? (
					<Avatar
						alt={user?.username}
						sx={{
							width: 56,
							height: 56,
						}}>
						{user?.username.charAt(0).toUpperCase()}
					</Avatar>
				) : (
					<Avatar />
				)}
				<Typography variant='h5'>{user.username}</Typography>
				{isOwner && (
					<>
						<IconButton
							size='small'
							onClick={handleFollow}
							sx={{
								color: 'primary.contrastText',
								backgroundColor: 'primary.light',

								'&:hover': {
									opactiy: 0.9,
								},
								borderRadius: 2,
							}}>
							{isFollowing ? <RemoveIcon /> : <AddIcon />}
						</IconButton>
						<UserSettings
							sx={{
								display: { xs: 'block', md: 'none' },
								color: 'primary.darkText',
								width: 40,
								height: 40,
							}}
						/>
					</>
				)}
			</Box>
			<Stack spacing={15} direction='row'>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}>
					<Typography variant='h6'>works</Typography>
					<Typography
						variant='h6'
						sx={{
							color: 'primary.darkText',
							fontSize: 18,
						}}>
						{5}
					</Typography>
				</Box>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}>
					<Typography variant='h6'>forked</Typography>
					<Typography
						variant='h6'
						sx={{
							color: 'primary.darkText',
							fontSize: 18,
						}}>
						{5}
					</Typography>
				</Box>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}>
					<Typography variant='h6'>follow</Typography>
					<Typography
						variant='h6'
						sx={{
							color: 'primary.darkText',
							fontSize: 18,
						}}>
						{5}
					</Typography>
				</Box>
			</Stack>
			{isOwner && (
				<UserSettings
					sx={{
						display: { xs: 'none', md: 'block' },
						color: 'primary.darkText',
					}}
				/>
			)}
		</Box>
	)
}

const UserSettings = ({ sx }) => {
	const [anchorEl, setAnchorEl] = useState(null)
	const open = !!anchorEl
	const handleClick = event => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}

	return (
		<>
			<IconButton onClick={handleClick} sx={sx}>
				<SettingsIcon color='inherit' />
			</IconButton>
			<Menu
				id='basic-menu'
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}>
				<MenuList>
					<MenuItem>
						<ListItemIcon>
							<ManageAccountsIcon fontSize='small' />
						</ListItemIcon>
						<ListItemText>Edit Profile</ListItemText>
					</MenuItem>
					<MenuItem>
						<ListItemIcon>
							<WorkspacesIcon fontSize='small' />
						</ListItemIcon>
						<ListItemText>Manage works</ListItemText>
					</MenuItem>
				</MenuList>
			</Menu>
		</>
	)
}

export default Profile
