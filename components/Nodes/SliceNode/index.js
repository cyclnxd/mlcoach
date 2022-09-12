import React, { useState, useRef, useEffect, memo } from 'react'
import Box from '@mui/material/Box'
import {TextField} from '@mui/material'
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
	const startTextHandle = (event) => { 
		if(event.target.value === NaN){ 
			setStartSliceRef(0)
			 prevSSlice.current = 0
			}

		setStartSliceRef(parseInt(event.target.value))
	}
	const endTextHandle =(event) => {
		if(event.target.value === NaN) {
			setEndSliceRef(-1) 
			prevESlice.current  = -1}
			setEndSliceRef(parseInt(event.target.value))
		 
	}
	const handleDelete = () => {
		store.getState().onNodesChange([{ id: id, type: 'remove' }])
		setConnectionSource('-1')
	}
	store.subscribe(
		() => {
			setConnectionSource(store.getState().connectionSource)
			setConnectionTarget(store.getState().connectionTarget)

		},
	)
	useEffect(() => {	prevSSlice.current = startSliceRef
		prevESlice.current = endSliceRef
		if (connectionTarget === id) {
			if (connectionSource !== '-1') {
			 
				setFileData(store.getState().fileMap[connectionSource].data.slice(prevSSlice.current,prevESlice.current))
				 let file = {data : store.getState().fileMap[connectionSource].data.slice(prevSSlice.current,prevESlice.current),
							 meta : store.getState().fileMap[connectionSource].meta}
				store.getState().storeFile(id,file )
				// console.log(fileData.data)
			 
			}
		}
 
		// store.getState().storeFile(id, fileData)
	}, [connectionSource, connectionTarget,  endSliceRef,startSliceRef])

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
				<Stack spacing={0}>
					<HeaderLayout title='Slice' onDelete={handleDelete} />
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							padding: '10px',
							gap: '10px',
						}}>
						<Box sx={{
							height: '150px',
							width: '100px'
						}}>
							 <TextField
								id="outlined-name"
								label="Start"
								sx={{

									height:'25px',
									backgroundColor: 'primary.light'
								}}
								onChange={startTextHandle}
							/>
							 <TextField
								id="outlined-name"
								label="End"
								sx={{	
									marginTop: '50px',
									height:'25px',
									backgroundColor: 'primary.light'
								}}
								onChange={endTextHandle}
								
							/>

						</Box>

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
