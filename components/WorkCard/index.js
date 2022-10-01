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
import create from 'zustand'
import ForkLeftIcon from '@mui/icons-material/ForkLeft'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import VisibilityIcon from '@mui/icons-material/Visibility'
import UserAvatar from 'components/UserAvatar'
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PublicIcon from '@mui/icons-material/Public'

function WorkCard({ work, props, avatar_url, isOwner }) {
	const [open, setOpen] = useState(false)

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}
	const { like, forked, view, name, thumbnail_url, description } = work

	return (
		<Box {...props}>
			<Card sx={{}}>
				<CardActionArea onClick={handleClickOpen}>
					{thumbnail_url ? (
						<Image
							src={thumbnail_url}
							alt={name}
							width={1920}
							height={900}
							objectFit='cover'
							loading='lazy'
						/>
					) : (
						<Skeleton variant='rectangular' width={1200} height={170} />
					)}
					<CardContent>
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
						<Typography
							variant='body2'
							color='text.secondary'
							sx={{
								overflow: 'clip',
								whiteSpace: 'nowrap',
								textOverflow: 'ellipsis',
								mb: 2,
							}}>
							{description || 'No description'}
						</Typography>
						<Typography variant='body2' color='text.secondary' sx={{}}>
							<strong>like:</strong> {like} <strong>forked:</strong> {forked}{' '}
							<strong>view:</strong> {view}
						</Typography>
					</CardContent>
				</CardActionArea>
			</Card>
			<WorkDetails
				open={open}
				handleClose={handleClose}
				work={work}
				avatar_url={avatar_url}
				isOwner={isOwner}
			/>
		</Box>
	)
}

const WorkDetails = ({ open, handleClose, work, avatar_url, isOwner }) => {
	const { like, forked, view, name, thumbnail_url, description, username } =
		work

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
								gap: 2,
							}}>
							<UserAvatar src={avatar_url} username={username} />
							<Typography variant='h6'>{username}</Typography>
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
										<ListItemText>Change public</ListItemText>
									</MenuItem>
								)}

								<MenuItem>
									<ListItemIcon>
										<ReportGmailerrorredIcon />
									</ListItemIcon>
									<ListItemText>Report</ListItemText>
								</MenuItem>
							</MenuList>
						</Menu>
					</Stack>
				</DialogTitle>

				<Divider />
				<DialogContent>
					<>
						{thumbnail_url ? (
							<Image
								src={thumbnail_url}
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
						<Typography variant='h6'>{name}</Typography>
					</DialogContentText>
					<DialogContentText
						tabIndex={-1}
						sx={{
							wordWrap: 'break-word',
						}}>
						<Typography variant='body2' paragraph color='text.secondary'>
							{description || 'No description'}
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
								{like}
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
								{forked}
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
							{view}
						</Typography>
					</Box>
				</Box>
			</Stack>
		</Dialog>
	)
}

export default WorkCard
