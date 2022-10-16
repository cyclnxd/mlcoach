import { IconButton, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import UserAvatar from 'components/base/UserAvatar'
import { memo, useEffect, useState } from 'react'
import useDataStore from 'lib/store/DataStore.ts'
import UserSettings from './components/UserSettings'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { useTranslations } from 'next-intl'

const UserProfile = ({ user, works, isOwner, session }) => {
	const t = useTranslations('profile')
	const { followUser, getFollowers } = useDataStore(state => state)
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
	}, [getFollowers, session?.user?.id, user?.id, works])

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
				<UserAvatar src={user?.avatar_url} username={user?.username} />
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
				{!isOwner && session?.user && (
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
					<Typography variant='h6'>{t('work')}</Typography>
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
					<Typography variant='h6'>{t('forks')}</Typography>
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
					<Typography variant='h6'>{t('follow')}</Typography>
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

export default memo(UserProfile)
