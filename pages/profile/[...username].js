import { useRouter } from 'next/router'
import useDataStore from 'lib/store/DataStore.ts'
import { useEffect, useState } from 'react'
import { Stack, Box } from '@mui/material'
import Head from 'next/head'
import Loading from 'components/base/Loading'
import useAuthStore from 'lib/store/AuthStore.ts'
import UserWorks from 'components/Profile/UserWorks'
import UserProfile from 'components/Profile/UserProfile'

function Profile() {
	const router = useRouter()
	const { username } = router.query
	const { getUserByUsername, getWorksByUsername } = useDataStore(state => state)
	const session = useAuthStore(state => state.session)

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
						'&::-webkit-scrollbar': {
							width: 0,
						},
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

export default Profile
