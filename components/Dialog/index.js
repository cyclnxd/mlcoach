import {
	Autocomplete,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	TextField,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState, useEffect } from 'react'
import useDataStore from 'lib/store/DataStore.ts'
import create from 'zustand'

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
	const { getWorksByUsername, deleteWorkByUsernameAndName } =
		create(useDataStore)()

	const handleDeleteWork = async value => {
		await deleteWorkByUsernameAndName(username, value)
		setWorks(works.filter(work => work.name !== value))
	}

	useEffect(() => {
		async function fetchData() {
			setLoading(true)
			const works = await getWorksByUsername(username)
			setWorks(works)
			setLoading(false)
		}
		if (username && open) fetchData()
	}, [getWorksByUsername, username, open])

	return (
		<>
			{!loading ? (
				<Dialog open={open} onClose={handleClose}>
					<DialogTitle>{title}</DialogTitle>
					<DialogContent>
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
					</DialogContent>

					<DialogActions>
						<Button onClick={handleClose}>Cancel</Button>
						<Button
							onClick={async () => {
								await callback(value)
								handleClose()
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
