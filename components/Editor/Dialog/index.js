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
import { useState, useEffect } from 'react'
import useDataStore from 'lib/store/DataStore.ts'
import moment from 'moment/moment'
import { useTranslations } from 'next-intl'

function CustomDialog({
	open,
	handleClose,
	callback,
	title,
	content,
	label,
	username,
}) {
	const t = useTranslations('editor.editorDialog')
	const [value, setValue] = useState('')
	const [description, setDescription] = useState('')
	const [works, setWorks] = useState([])
	const [loading, setLoading] = useState(false)
	const { getWorksByUsername, deleteWorkByUsernameAndName } = useDataStore(
		state => state
	)

	const handleDeleteWork = async value => {
		await deleteWorkByUsernameAndName(username, value)
		setWorks(works.filter(work => work.name !== value))
	}

	useEffect(() => {
		async function fetchData() {
			setLoading(true)
			const works = await getWorksByUsername(username)

			if (works) {
				setWorks(works)
			} else {
				setValue(null)
			}

			setLoading(false)
		}
		if (username && open) fetchData()
	}, [getWorksByUsername, username, open])

	useEffect(() => {
		if (value) {
			const work = works.find(work => work.name === value)

			setDescription(work?.description || '')
		} else {
			setDescription('')
		}
	}, [value, works])

	return (
		<>
			{!loading ? (
				<Dialog open={open} onClose={handleClose}>
					<DialogTitle>{title}</DialogTitle>
					<DialogContent>
						{works.length > 0 || title === t('save') ? (
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
											{t('works')}
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
														src={work.thumbnail_url}
														sx={{
															width: 150,
															height: 80,
															borderRadius: 1,
														}}
													/>
												</ListItemAvatar>

												<ListItemText
													primary={
														<Typography
															variant='h6'
															component='span'
															sx={{
																overflow: 'clip',
																whiteSpace: 'nowrap',
																textOverflow: 'ellipsis',
															}}>
															{work.name}
														</Typography>
													}
													secondary={moment(
														work.created_at,
														null,
														'tr'
													).fromNow()}
													sx={{
														overflow: 'clip',
														whiteSpace: 'nowrap',
														textOverflow: 'ellipsis',
														ml: 1,
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
								<DialogContentText
									sx={{
										color: 'primary.main',
										mb: 1,
									}}>
									{content}
								</DialogContentText>
								<Autocomplete
									sx={{
										mb: 2,
									}}
									value={value}
									onChange={(_, newValue) => {
										setValue(newValue)
									}}
									options={works.map(work => work.name || 'noname')}
									renderOption={(props, option) => (
										<li {...props}>
											{option}
											<IconButton
												edge='end'
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

								<DialogContentText
									sx={{
										display: title === t('open') ? 'none' : 'block',
										color: 'primary.main',
										mb: 1,
									}}>
									{t('desc3')}
								</DialogContentText>
								<TextField
									disabled={title === t('open')}
									fullWidth
									multiline
									value={description}
									label={t('placeholder2')}
									type='text'
									variant='standard'
									onChange={e => {
										setDescription(e.target.value)
									}}
								/>
							</>
						) : (
							<DialogContentText>{t('desc4')}</DialogContentText>
						)}
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose}>{t('cancel')}</Button>
						<Button
							disabled={!value || works.length < 0}
							onClick={async () => {
								if (value) {
									await callback(value, description)
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
