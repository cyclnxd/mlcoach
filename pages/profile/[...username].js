import { useRouter } from 'next/router'
import useDataStore from '../../lib/store/UserDataStore.ts'
import create from 'zustand'
import { useEffect, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import Head from 'next/head'
function Profile() {
	const router = useRouter()
	const { username } = router.query
	const { getUserByUsername } = create(useDataStore)()
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)
	useEffect(() => {
		async function getUser() {
			setLoading(true)
			const user = await getUserByUsername(username)
			setUser(user)
			setLoading(false)
		}
		getUser()
	}, [getUserByUsername, username])

	return (
		<>
			<Head>
				<title>MLCoach {username}`s profile</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			{loading ? (
				<Box
					sx={{
						width: '100vw',
						height: '100vh',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}>
					<CircularProgress
						sx={{
							color: 'primary.light',
						}}
					/>
				</Box>
			) : (
				<div>
					<h1>Profile</h1>
					<p>Profile page of user {user.id}</p>
				</div>
			)}
		</>
	)
}

export default Profile
