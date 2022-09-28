import {
	Autocomplete,
	Avatar,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	TextField,
	Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState, useEffect, useCallback } from 'react'
import useDataStore from 'lib/store/DataStore.ts'
import create from 'zustand'
import moment from 'moment/moment'

function CustomDialog({
	open,
	handleClose,
	callback,
	title,
	content,
	label,
	username,
}) {
	const [value, setValue] = useState('')
	const [works, setWorks] = useState([])
	const [loading, setLoading] = useState(false)
	const { getWorksByUsername, deleteWorkByUsernameAndName, getPublicUrl } =
		create(useDataStore)()

	const handleDeleteWork = async value => {
		await deleteWorkByUsernameAndName(username, value)
		setWorks(works.filter(work => work.name !== value))
	}

	const getUrl = useCallback(
		async id => {
			const url = await getPublicUrl(id)
			return url.publicURL
		},
		[getPublicUrl]
	)
	useEffect(() => {
		async function fetchData() {
			setLoading(true)
			const works = await getWorksByUsername(username)
			works.forEach(async work => {
				work.url = await getUrl(work.id)
			})
			if (works) {
				setWorks(works)
			} else {
				setValue(null)
			}

			setLoading(false)
		}
		if (username && open) fetchData()
	}, [getWorksByUsername, username, open, getUrl])

	return (
		<>
			{!loading ? (
				<Dialog open={open} onClose={handleClose}>
					<DialogTitle>{title}</DialogTitle>
					<DialogContent>
						{works.length > 0 || title === 'Save Editor' ? (
							<>
								{works.length > 0 && (
									<List
										sx={{
											width: '100%',
											mb: 2,
											maxHeight: '250px',
											overflow: 'auto',
											border: '1px solid',
											borderColor: 'primary.dark',
											pt: 1,
										}}>
										<Typography
											variant='h6'
											sx={{
												width: '100%',
												justifyContent: 'center',
												alignItems: 'center',
												display: 'flex',
												pb: 1,
											}}>
											Your Works
										</Typography>
										<Divider width={'100%'} />
										{works.map(work => (
											<ListItem
												key={work.name}
												selected={value === work.name}
												onClick={() => {
													setValue(work.name)
												}}>
												<ListItemAvatar>
													<Avatar
														alt={work.name}
														src={work.url}
														sx={{
															width: 150,
															height: 80,
															borderRadius: 1,
														}}
													/>
												</ListItemAvatar>

												<ListItemText
													primary={work.name}
													secondary={moment(work.updated_at).fromNow()}
													sx={{
														width: '100%',
														justifyContent: 'center',
														alignItems: 'center',
														display: 'flex',
														flexDirection: 'column',
													}}
												/>
												<IconButton
													edge='end'
													aria-label='delete'
													onClick={() => handleDeleteWork(work.name)}>
													<DeleteIcon />
												</IconButton>
											</ListItem>
										))}
									</List>
								)}
								<DialogContentText>{content}</DialogContentText>
								<Autocomplete
									value={value}
									onChange={(_, newValue) => {
										setValue(newValue)
									}}
									options={works.map(work => work.name || 'noname')}
									renderOption={(props, option) => (
										<li {...props}>
											{option}
											<IconButton
												color='primary'
												aria-label='delete work'
												component='label'
												sx={{ ml: 'auto' }}
												onClick={async () => {
													await handleDeleteWork(option)
													setValue('')
												}}>
												<DeleteIcon />
											</IconButton>
										</li>
									)}
									freeSolo
									renderInput={params => (
										<TextField
											{...params}
											autoFocus
											margin='dense'
											label={label}
											type='text'
											variant='standard'
											onChange={e => {
												setValue(e.target.value)
											}}
										/>
									)}
								/>
							</>
						) : (
							<DialogContentText>
								You don&apos;t have any saved work
							</DialogContentText>
						)}
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose}>Cancel</Button>
						<Button
							disabled={!value || works.length < 0}
							onClick={async () => {
								if (value) {
									await callback(value)
									handleClose()
								}
							}}>
							{title}
						</Button>
					</DialogActions>
				</Dialog>
			) : (
				<> </>
			)}
		</>
	)
}

export default CustomDialog
