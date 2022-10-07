import {
	Box,
	Card,
	CardActionArea,
	CardContent,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	MenuList,
	Skeleton,
	Typography,
} from '@mui/material'
import { Stack } from '@mui/system'
import useDataStore from 'lib/store/DataStore.ts'
import Image from 'next/image'
import { useState } from 'react'
import ForkLeftIcon from '@mui/icons-material/ForkLeft'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import VisibilityIcon from '@mui/icons-material/Visibility'
import UserAvatar from 'components/base/UserAvatar'
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PublicIcon from '@mui/icons-material/Public'
import Link from 'next/link'
import { useEffect } from 'react'
import moment from 'moment'
import { useTranslations } from 'next-intl'

function WorkCard({ work, props, isOwner = false, type = 'profile' }) {
	const e = useTranslations('errors')
	const t = useTranslations('workCard')
	const [open, setOpen] = useState(false)
	const [error, setError] = useState(null)
	const [avatarUrl, setAvatarUrl] = useState(null)
	const getUserByUsername = useDataStore(state => state.getUserByUsername)

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}
	const {
		like,
		forked,
		view,
		name,
		thumbnail_url: thumbnailUrl,
		description,
		username,
		created_at: createdAt,
	} = work

	useEffect(() => {
		async function fetchData() {
			try {
				const url = await getUserByUsername(work.username, 'avatar_url')
				setAvatarUrl(url.avatar_url)
				setError(null)
			} catch (error) {
				setError(error)
			}
		}
		fetchData()
	}, [getUserByUsername, work])

	return (
		<>
			{error ? (
				<Box sx={{}}>
					<h1>{e('wentWrong')}</h1>
				</Box>
			) : (
				<Box {...props}>
					<Card>
						<CardActionArea onClick={handleClickOpen}>
							{thumbnailUrl ? (
								<Image
									src={thumbnailUrl}
									alt={name}
									width={1920}
									height={1200}
									objectFit='cover'
									loading='lazy'
								/>
							) : (
								<Skeleton variant='rectangular' width={1200} height={170} />
							)}
						</CardActionArea>
						<CardContent>
							<Typography
								variant='body2'
								color='text.secondary'
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'start',
									fontSize: 10,
									mt: -1,
								}}>
								{moment(createdAt, null, 'tr').fromNow()}
							</Typography>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}>
								<Typography
									gutterBottom
									variant='h5'
									component='div'
									sx={{
										overflow: 'clip',
										whiteSpace: 'nowrap',
										textOverflow: 'ellipsis',
									}}>
									{name}
								</Typography>
								{type === 'workplace' && (
									<Link href={`/profile/${username}`}>
										<Box
											onClick={e => e.stopPropagation()}
											sx={{
												display: 'flex',
												flexDirection: 'row',
												alignItems: 'start',
												mb: 1,
												gap: 1,
												ml: 1,
												borderRadius: 1,
												'&:hover': {
													cursor: 'pointer',
													backgroundColor: 'rgba(0, 0, 0, 0.04)',
													transform: 'scale(1.05)',
												},
											}}>
											<UserAvatar
												src={avatarUrl}
												username={username}
												size={20}
											/>
											<Typography variant='body2'>{username}</Typography>
										</Box>
									</Link>
								)}
							</Box>

							<Typography
								variant='body2'
								color={description ? 'text.primary' : 'text.secondary'}
								sx={{
									overflow: 'clip',
									whiteSpace: 'nowrap',
									textOverflow: 'ellipsis',
									mb: 2,
								}}>
								{description || t('noneDescription')}
							</Typography>

							<Typography
								variant='body2'
								color='text.secondary'
								sx={{
									overflow: 'clip',
									whiteSpace: 'nowrap',
									textOverflow: 'ellipsis',
								}}>
								<strong>{t('like')}:</strong> {like || 0}{' '}
								<strong>{t('forks')}:</strong> {forked || 0}{' '}
								<strong>{t('view')}:</strong> {view || 0}
							</Typography>
						</CardContent>
					</Card>
					<WorkDetails
						open={open}
						handleClose={handleClose}
						work={work}
						avatarUrl={avatarUrl}
						isOwner={isOwner}
					/>
				</Box>
			)}
		</>
	)
}

const WorkDetails = ({
	open,
	handleClose,
	work,
	avatarUrl,
	isOwner = false,
}) => {
	const {
		like,
		forked,
		view,
		name,
		thumbnail_url: thumbnailUrl,
		description,
		username,
	} = work
	const t = useTranslations('workCard')
	const [anchorEl, setAnchorEl] = useState(null)
	const openMenu = !!anchorEl
	const handleOpenMenu = event => {
		setAnchorEl(event.currentTarget)
	}
	const handleCloseMenu = () => {
		setAnchorEl(null)
	}
	return (
		<Dialog onClose={handleClose} open={open} scroll={'paper'}>
			<Stack spacing={0} direction='column'>
				<DialogTitle>
					<Stack
						direction='row'
						sx={{
							justifyContent: 'space-between',
						}}>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'start',
								alignItems: 'center',
								gap: 1,
							}}>
							<UserAvatar src={avatarUrl} username={username} />
							<Typography>{username}</Typography>
						</Box>
						<IconButton onClick={handleOpenMenu}>
							<MoreVertIcon />
						</IconButton>
						<Menu
							id='basic-menu'
							anchorEl={anchorEl}
							open={openMenu}
							onClose={handleCloseMenu}
							MenuListProps={{
								'aria-labelledby': 'basic-button',
							}}>
							<MenuList>
								{isOwner && (
									<MenuItem>
										<ListItemIcon>
											<PublicIcon />
										</ListItemIcon>
										<ListItemText>{t('changePublic')}</ListItemText>
									</MenuItem>
								)}

								<MenuItem>
									<ListItemIcon>
										<ReportGmailerrorredIcon />
									</ListItemIcon>
									<ListItemText>{t('report')}</ListItemText>
								</MenuItem>
							</MenuList>
						</Menu>
					</Stack>
				</DialogTitle>

				<Divider />
				<DialogContent>
					<>
						{thumbnailUrl ? (
							<Image
								src={thumbnailUrl}
								alt={name}
								width={1920}
								height={900}
								objectFit='cover'
								loading='lazy'
								style={{
									borderRadius: '8px',
								}}
							/>
						) : (
							<Skeleton
								variant='rectangular'
								width={1920}
								height={900}
								sx={{
									borderRadius: '8px',
								}}
							/>
						)}
					</>

					<DialogContentText sx={{ my: 2 }}>
						<Typography variant='h5' color={'text.primary'}>
							{name}
						</Typography>
					</DialogContentText>
					<DialogContentText
						tabIndex={-1}
						sx={{
							wordWrap: 'break-word',
						}}>
						<Typography variant='body2' paragraph color='text.secondary'>
							{description || t('changePublic')}
						</Typography>
					</DialogContentText>
				</DialogContent>
				<Divider />
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						p: 2,
					}}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',

								mr: 4,
							}}>
							<IconButton aria-label='like'>
								<ThumbUpOffAltIcon />
							</IconButton>
							<Typography marginLeft={1} variant='body2' color='text.secondary'>
								{like || 0}
							</Typography>
						</Box>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
								mr: 2,
							}}>
							<IconButton aria-label='forked'>
								<ForkLeftIcon sx={{ width: 24, height: 24 }} />
							</IconButton>
							<Typography marginLeft={1} variant='body2' color='text.secondary'>
								{forked || 0}
							</Typography>
						</Box>
					</div>

					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
							mr: 2,
							gap: 1,
						}}>
						<VisibilityIcon
							sx={{ width: 24, height: 24, color: 'text.secondary' }}
						/>
						<Typography marginLeft={1} variant='body2' color='text.secondary'>
							{view || 0}
						</Typography>
					</Box>
				</Box>
			</Stack>
		</Dialog>
	)
}

export default WorkCard
