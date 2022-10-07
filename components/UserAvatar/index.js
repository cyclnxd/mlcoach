import { Avatar, Skeleton } from '@mui/material'
import { useEffect, useState } from 'react'

function UserAvatar({ username, src, size }) {
	const [loading, setLoading] = useState(true)
	useEffect(() => {
		try {
			if (src === undefined || src === null) {
				setLoading(true)
			} else {
				setLoading(false)
			}
		} catch (error) {
		} finally {
			setLoading(false)
		}
	}, [src, username])

	return (
		<>
			{loading ? (
				<Skeleton
					variant='circular'
					animation='wave'
					width={size || 50}
					height={size || 50}
					color='primary.darkText'
					sx={{
						backgroundColor: 'primary.main',
						border: '1px solid',
						borderColor: 'primary.light',
					}}
				/>
			) : src ? (
				<Avatar
					alt={username}
					src={src}
					sx={{
						width: size || 50,
						height: size || 50,
					}}
				/>
			) : username?.length > 0 ? (
				<Avatar
					alt={username}
					sx={{
						width: size || 50,
						height: size || 50,
					}}>
					{username.charAt(0).toUpperCase()}
				</Avatar>
			) : (
				<Avatar
					alt={'Avatar'}
					sx={{
						width: size || 50,
						height: size || 50,
					}}
				/>
			)}
		</>
	)
}

export default UserAvatar
