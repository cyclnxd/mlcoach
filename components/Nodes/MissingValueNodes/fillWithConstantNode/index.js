import React, { useState, useEffect, memo } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import store from '../../../../lib/store/store.ts'
import { Handle } from 'react-flow-renderer'
import { Card, Stack, Typography, TextField } from '@mui/material'
import HeaderLayout from '../../HeaderLayout'

function FillingConstantNode({ id, selected, data }) {
	const [fillingValue, setFillingValue] = useState(0)

	const [error, setError] = useState('connect a data source to select columns')

	const startTextHandle = event => {
		event.target.value === NaN
			? () => {
					setFillingValue(0)
			  }
			: setFillingValue(parseInt(event.target.value))
	}
	useEffect(() => {
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
					data: file.data,
				}
				for (var row in file.data) {
					for (const column of Object.keys(
						store.getState().fileMap[sourceId].data[0]
					)) {
						if (!file.data[row][column]) {
							file.data[row][column] = fillingValue
						}
					}
				}
				store.getState().storeFile(id, file)
			} else {
				setError('data source has no data')
			}
		} else {
			setError('connect a data source to slice data')
		}
	}, [fillingValue, id, selected, data])
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
					<HeaderLayout title='Constant Fill' id={id} />
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
						{error.length === 0 ? (
							<>
								<TextField
									id='outlined-name'
									label='Value to fill'
									className='nodrag'
									size='small'
									type='number'
									onChange={startTextHandle}
								/>
							</>
						) : (
							<Typography>{error}</Typography>
						)}
					</Box>
				</Stack>
			</Card>
			<Box
				sx={{
					height: '75px',
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
						height: '75px',
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

export default memo(FillingConstantNode)
