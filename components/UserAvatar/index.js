import { Avatar } from '@mui/material'

function UserAvatar({ username, src, size }) {
	return (
		<>
			{src ? (
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
					sx={{
						width: 50,
						height: 50,
					}}
				/>
			)}
		</>
	)
}

export default UserAvatar
