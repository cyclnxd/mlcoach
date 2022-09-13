import React, { useState, useRef, useEffect, memo } from 'react'
import Box from '@mui/material/Box'
import { TextField } from '@mui/material'
import Grid from '@mui/material/Grid'
import store from '../../../store/store.ts'
import { Handle } from 'react-flow-renderer'
import { Card, Stack, Typography } from '@mui/material'
import HeaderLayout from '../HeaderLayout'

function SliceNode({ id, selected }) {
	const [startSliceRef, setStartSliceRef] = useState(0)
	const [endSliceRef, setEndSliceRef] = useState(-1)
	const prevSSlice = useRef(startSliceRef)
	const prevESlice = useRef(endSliceRef)
	const [connectionSource, setConnectionSource] = useState()
	const [connectionTarget, setConnectionTarget] = useState()
	const [fileData, setFileData] = useState()
	const startTextHandle = event => {
		if (event.target.value === NaN) {
			setStartSliceRef(0)
			prevSSlice.current = 0
		}

		setStartSliceRef(parseInt(event.target.value))
	}
	const endTextHandle = event => {
		if (event.target.value === NaN) {
			setEndSliceRef(-1)
			prevESlice.current = -1
		}
		setEndSliceRef(parseInt(event.target.value))
	}
	const handleDelete = () => {
		store.getState().onNodesChange([{ id, type: 'remove' }])
		setConnectionSource('-1')
	}
	store.subscribe(() => {
		setConnectionSource(store.getState().connectionSource)
		setConnectionTarget(store.getState().connectionTarget)
	})
	useEffect(() => {
		prevSSlice.current = startSliceRef
		prevESlice.current = endSliceRef
		console.log(
			Object.values(store.getState().edges).find(item => item.target === id)[
				'source'
			]
		)
		if (
			Object.values(store.getState().edges).find(item => item.target === id)
		) {
			//console.log(Object.values(store.getState().edges).map(item => item.source))
			//  let file = {data : store.getState().fileMap[Object.values(store.getState().edges).find(item => item.source)].data.slice(prevSSlice.current,prevESlice.current),
			//              meta : store.getState().fileMap[Object.values(store.getState().edges).find(item => item.source)].meta}
			// store.getState().storeFile(id,file )
			// console.log(fileData.data)
		}

		// store.getState().storeFile(id, fileData)
	}, [startSliceRef, endSliceRef, id])
	// useEffect(() => {
	// 	prevSSlice.current = startSliceRef
	// 	prevESlice.current = endSliceRef
	// 	if (connectionTarget === id) {
	// 		if (connectionSource !== '-1') {
	// 			setFileData(
	// 				store
	// 					.getState()
	// 					.fileMap[connectionSource].data.slice(
	// 						prevSSlice.current,
	// 						prevESlice.current
	// 					)
	// 			)
	// 			let file = {
	// 				data: store
	// 					.getState()
	// 					.fileMap[connectionSource].data.slice(
	// 						prevSSlice.current,
	// 						prevESlice.current
	// 					),
	// 				meta: store.getState().fileMap[connectionSource].meta,
	// 			}
	// 			store.getState().storeFile(id, file)
	// 			// console.log(fileData.data)
	// 		}
	// 	}

	// 	// store.getState().storeFile(id, fileData)
	// }, [connectionSource, connectionTarget, endSliceRef, id, startSliceRef])

	return (
		<Grid container direction='row' justifyContent='center' alignItems='center'>
			<Box
				sx={{
					height: '15px',
					width: 15,
					backgroundColor: 'primary.light',
					borderRadius: '15px 0px 0px 15px',
				}}>
				<Handle
					type='target'
					position='left'
					id={`slice-in`}
					key={`${id}-in`}
					style={{
						left: '0%',
						width: '15px',
						top: '50%',
						height: '15px',
						background: 'none',
						border: 'none',
						borderRadius: '15px 0px 0px 15px',
					}}
					isConnectable={true}
				/>
			</Box>
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
					<HeaderLayout title='Slice' onDelete={handleDelete} />
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							padding: '10px',
							gap: '10px',
							width: '200px',
							'.MuiOutlinedInput-root': {
								color: 'primary.contrastText',
								fontSize: '12px',
							},
							'& label': {
								color: 'primary.contrastText',
								fontSize: '12px',
							},
							'& label.Mui-focused': {
								color: 'primary.contrastText',
							},
							'& .MuiInput-underline:after': {
								borderBottomColor: 'green',
							},
							'& .MuiOutlinedInput-root': {
								'& fieldset': {
									borderColor: 'primary.darkLight',
								},
								'&:hover fieldset': {
									borderColor: 'primary.light',
								},
								'&.Mui-focused fieldset': {
									borderColor: 'primary.light',
								},
							},
						}}>
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
					</Box>
				</Stack>
			</Card>
			<Box
				sx={{
					height: '100px',
					width: 15,
					backgroundColor: 'primary.light',
					borderRadius: '0px 15px 15px 0px',
				}}>
				<Handle
					type='source'
					position='right'
					id={`slice-out`}
					key={`${id}-out`}
					style={{
						left: '91%',
						width: '15px',
						top: '50%',
						height: '100px',
						background: 'none',
						border: 'none',
						borderRadius: '0px 15px 15px 0px',
					}}
					isConnectable={true}
				/>
			</Box>
		</Grid>
	)
}

export default memo(SliceNode)
