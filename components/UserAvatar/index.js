import { Avatar, Skeleton } from '@mui/material'
import { useEffect, useState } from 'react'

function UserAvatar({ username, src, size }) {
	const [loading, setLoading] = useState(true)
	useEffect(() => {
		if (src === undefined || src === null) {
			setLoading(true)
			if (username) {
				setLoading(false)
			}
		} else {
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
			) : (
				<Avatar
					alt={username}
					sx={{
						width: size || 50,
						height: size || 50,
					}}>
					{username.charAt(0).toUpperCase()}
				</Avatar>
			)}
		</>
	)
}

export default UserAvatar
