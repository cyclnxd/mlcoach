import { useRouter } from 'next/router'
import useDataStore from 'lib/store/DataStore.ts'
import create from 'zustand'
import { useEffect, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import Head from 'next/head'
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
			) : error.length > 0 ? (
				<div>
					<h1>User not found</h1>
				</div>
			) : (
				<div>
					<h1>Profile</h1>
					<p>Profile page of user {user?.id}</p>
				</div>
			)}
		</>
	)
}

export default Profile
