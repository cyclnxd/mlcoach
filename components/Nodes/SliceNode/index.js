import { useState, useRef, useEffect, memo } from 'react'
import Box from '@mui/material/Box'
import { TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import store from 'lib/store/store.ts'
import { Card, Stack } from '@mui/material'
import HeaderLayout from '../HeaderLayout'
import CustomHandle from '../CustomHandle'

function SliceNode({ id, selected, data }) {
	//holding slicing index values
	const [startSliceRef, setStartSliceRef] = useState(0)
	const [endSliceRef, setEndSliceRef] = useState(-1)
	//used for getting previous selected index
	const prevSSlice = useRef(startSliceRef)
	const prevESlice = useRef(endSliceRef)

	const [error, setError] = useState('connect a data source to select columns')
	// takes an event from text field and updates the startSliceRef state
	// if event target value is NaN then saves all element from source
	const startTextHandle = event => {
		event.target.value === NaN
			? () => {
					setStartSliceRef(0)
					prevSSlice.current = 0
			  }
			: setStartSliceRef(parseInt(event.target.value))
	}
	// takes an event from text field and updates the endSliceRef state
	// if event target value is NaN then saves all element from source
	const endTextHandle = event => {
		event.target.value === NaN
			? () => {
					setEndSliceRef(-1)
					prevESlice.current = -1
			  }
			: setEndSliceRef(parseInt(event.target.value))
	}
	// used to delete file stored in global storage when a node is deleted

	useEffect(() => {
		// get previous value of SliceRefs
		prevSSlice.current = startSliceRef
		prevESlice.current = endSliceRef
		// checking if the user has created a valid edge between two nodes

		const edge = Object.values(store.getState().edges).find(
			item => item.target === id
		)
		const sourceId = edge !== undefined ? edge.source : undefined
		if (sourceId !== undefined) {
			let file = structuredClone(store.getState().fileMap[sourceId])
			if (file !== undefined && file?.data.length > 0) {
				setError('')
				file = {
					...file,
					data: file.data.slice(prevSSlice.current, prevESlice.current),
				}
				store.getState().storeFile(id, file)
			} else {
				setError('data source has no data')
			}
		} else {
			store.getState().storeFile(id, undefined)
			setError('connect a data source to slice data')
		}
	}, [startSliceRef, endSliceRef, id, selected, data])

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
								<TextField
									id='outlined-name'
									label='Start'
									className='nodrag'
									size='small'
									type='number'
									onChange={startTextHandle}
								/>
								<TextField
									id='outlined-name'
									label='End'
									className='nodrag'
									size='small'
									type='number'
									onChange={endTextHandle}
								/>
							</>
						) : (
							<Typography>{error}</Typography>
						)}
					</Box>
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
