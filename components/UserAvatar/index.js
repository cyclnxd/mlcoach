import { Avatar } from '@mui/material'

function UserAvatar({ username, src, size }) {
	return (
		<>
			{src ? (
				<Avatar
					alt={username}
					src={src}
					sx={{
						width: 56,
						height: 56,
					}}
				/>
			) : username.length > 0 ? (
				<Avatar
					alt={username}
					sx={{
						width: size || 56,
						height: size || 56,
					}}>
					{username.charAt(0).toUpperCase()}
				</Avatar>
			) : (
				<Avatar />
			)}
		</>
	)
}

export default UserAvatar
