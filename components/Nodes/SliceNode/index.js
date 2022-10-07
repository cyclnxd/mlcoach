import { useState, useRef, useEffect, memo } from 'react'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import store from 'lib/store/store.ts'
import { Card, Stack } from '@mui/material'
import HeaderLayout from '../HeaderLayout'
import CustomHandle from '../CustomHandle'
import CustomTextField from 'components/base/CustomTextField'
import localforage from 'localforage'
import { useTranslations } from 'next-intl'

function SliceNode({ id, selected, data }) {
	const e = useTranslations('editor.nodes.errors')
	//holding slicing index values
	const [startSlice, setStartSlice] = useState(0)
	const [endSlice, setEndSlice] = useState(-1)
	const [error, setError] = useState('')
	const fileLengthRef = useRef(null)
	// takes an event from text field and updates the startSliceRef state
	// if event target value is NaN then saves all element from source
	const startTextHandle = event => {
		event.target.value === NaN
			? () => {
					setStartSlice(0)
			  }
			: setStartSlice(parseInt(event.target.value))
	}
	// takes an event from text field and updates the endSliceRef state
	// if event target value is NaN then saves all element from source
	const endTextHandle = event => {
		event.target.value === NaN
			? () => {
					setEndSlice(-1)
			  }
			: setEndSlice(parseInt(event.target.value))
	}

	// used to delete file stored in global storage when a node is deleted

	useEffect(() => {
		const deleteFile = async id => {
			await localforage.removeItem(id)
		}
		// checking if the user has created a valid edge between two nodes
		const edge = Object.values(store.getState().edges).find(
			item => item.target === id
		)
		const sourceId = edge !== undefined ? edge.source : undefined
		if (sourceId !== undefined) {
			localforage.getItem(sourceId).then(file => {
				if (file !== undefined && file?.data.length > 0) {
					fileLengthRef.current = file?.data.length + 1 // +1 for slice to include last element
					let newFile = {
						...file,
						data: file.data.slice(
							startSlice,
							endSlice === -1 ? file.data.length : endSlice
						),
					}
					localforage.setItem(id, newFile).then(() => {
						store.getState().storeFile(id)
					})
					setError('')
				} else {
					deleteFile(id)
					setError(e('noData'))
				}
			})
		} else {
			deleteFile(id)
			setError(e('noConnection'))
		}
	}, [id, selected, data, startSlice, endSlice, e])

	return (
		<Grid container direction='row' justifyContent='center' alignItems='center'>
			<CustomHandle
				type='target'
				position='left'
				id={`slice-in`}
				key={`slice-${id}-in`}
				isConnectable={true}
			/>
			<Card
				sx={{
					backgroundColor: 'primary.surface',
					color: 'white',
					justifyContent: 'center',
					alignItems: 'center',
				}}
				style={
					selected
						? { border: '0.5px solid #403f69' }
						: { border: '0.5px solid #333154' }
				}>
				<Stack spacing={1}>
					<HeaderLayout title='Slice' id={id} />
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							padding: '10px',
							gap: '10px',
							width: '200px',
						}}>
						{error.length === 0 ? (
							<>
								<CustomTextField
									fullWidth
									label='Start'
									className='nodrag'
									size='small'
									type='number'
									onChange={startTextHandle}
									value={startSlice}
									inputProps={{
										min: 0,
										max: fileLengthRef?.current,
									}}
								/>
								<CustomTextField
									fullWidth
									label='End'
									className='nodrag'
									size='small'
									type='number'
									onChange={endTextHandle}
									value={endSlice}
									inputProps={{
										min: -1,
										max: fileLengthRef?.current,
									}}
								/>
							</>
						) : (
							<Typography>{error}</Typography>
						)}
					</Box>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',

							cursor: 'pointer',
						}}></Box>
				</Stack>
			</Card>

			<CustomHandle
				type='source'
				position='right'
				id={`slice-out`}
				key={`slice-${id}-out`}
				isConnectable={true}
			/>
		</Grid>
	)
}

export default memo(SliceNode)
