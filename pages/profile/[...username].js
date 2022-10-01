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
	Grid,
} from '@mui/material'
import Head from 'next/head'
import Loading from 'components/Loading'
import useAuthStore from 'lib/store/AuthStore.ts'
import SettingsIcon from '@mui/icons-material/Settings'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import WorkCard from 'components/WorkCard'
import UserAvatar from 'components/UserAvatar'
function Profile() {
	const router = useRouter()
	const { username } = router.query
	const { getUserByUsername, getWorksByUsername } = create(useDataStore)()
	const { session } = create(useAuthStore)()

	const [user, setUser] = useState(null)
	const [works, setWorks] = useState([])
	const [error, setError] = useState('')
	const [title, setTitle] = useState('Loading...')
	const [loading, setLoading] = useState(true)
	const [isOwner, setIsOwner] = useState(false)

	useEffect(() => {
		async function getUser() {
			setLoading(true)
			if (username) {
				setTitle(`MLCoach ${username}'s profile`)
				try {
					const data = await getUserByUsername(username)
					const works = await getWorksByUsername(username)
					setUser(data)
					setWorks(works)
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
	}, [getUserByUsername, getWorksByUsername, username])
	useEffect(() => {
		setIsOwner(session?.user?.id === user?.id)
	}, [session?.user?.id, user])

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
					component='main'
					container
					spacing={2}
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'start',
						justifyContent: 'start',
						height: 'calc(100vh - 70px)',
						width: '100vw',
						p: 3,
						mb: 2,
						overflowY: 'scroll',
						overflowX: 'hidden',
					}}>
					<UserProfile
						user={user}
						works={works}
						isOwner={isOwner}
						session={session}
					/>
					<Box
						sx={{
							width: '100%',
							height: '100%',
						}}>
						<UserWorks
							works={works}
							avatar_url={user?.avatar_url}
							isOwner={isOwner}
						/>
					</Box>
				</Stack>
			)}
		</>
	)
}

const UserProfile = ({ user, works, isOwner, session }) => {
	const { followUser, getFollowers } = create(useDataStore)()
	const [followers, setFollowers] = useState([])
	const [isFollowing, setIsFollowing] = useState(false)

	const worksLength = works.length
	const forks = works.reduce((acc, work) => acc + work.forked, 0)
	const handleFollow = async () => {
		try {
			await followUser(session?.user?.id, user.id, !isFollowing)
			const followers = await getFollowers(user.id)
			setFollowers(followers)
			setIsFollowing(!!followers.find(f => f.follower === session?.user?.id))
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		async function fetchFollowers() {
			const followers = await getFollowers(user.id)
			setFollowers(followers)
			setIsFollowing(!!followers.find(f => f.follower === session?.user?.id))
		}
		fetchFollowers()
	}, [getFollowers, session?.user?.id, user.id, works])

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
					gap: { xs: 4, md: 2 },
				}}>
				<UserAvatar src={user?.avatar_url} username={user.username} />
				<Typography variant='h5'>{user.username}</Typography>
				{isOwner && (
					<>
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
				{!isOwner && (
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
				)}
			</Box>
			<Stack
				spacing={8}
				direction='row'
				sx={{
					ml: { xs: 0, md: -10 },
					mx: { xs: 0, md: 'auto' },
				}}>
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
						{worksLength}
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
						{forks}
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
						{followers.length}
					</Typography>
				</Box>
			</Stack>
			{isOwner && (
				<UserSettings
					sx={{
						display: { xs: 'none', md: 'block' },
						color: 'primary.darkText',
						width: 40,
						height: 40,
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

const UserWorks = ({ works, avatar_url, isOwner }) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				alignItems: 'start',
				width: '100%',

				p: 3,
				gap: { xs: 2, md: 4 },
				backgroundColor: 'primary.darkLight',
				borderRadius: 2,
			}}>
			<Typography variant='h6' sx={{ color: 'primary.contrastText' }}>
				Works
			</Typography>
			<Grid container spacing={2}>
				{works.map(work => (
					<Grid item xs={12} sm={6} md={4} lg={3} key={work.id}>
						<WorkCard work={work} avatar_url={avatar_url} isOwner={isOwner} />
					</Grid>
				))}
			</Grid>
		</Box>
	)
}

export default Profile
