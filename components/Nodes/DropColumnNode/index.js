import React, { useState, useEffect, memo } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import store from '../../../store/store.ts'
import { Handle } from 'react-flow-renderer'
import {
	Card,
	Stack,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from '@mui/material'
import HeaderLayout from '../HeaderLayout'

function DropColumnNode({ id, selected, data }) {
	// store the columns of DataFrame
	const [keys, setKeys] = useState([])
	// store the selected unique columns
	const [selectedColumns, setSelectedColumns] = useState(() => [])
	const [error, setError] = useState('connect a data source to select columns')
	// takes the selected columns and adds it to end of the Set structure
	const handleSelected = (_, columns) => {
		setSelectedColumns(columns)
	}
	useEffect(() => {
		const edge = Object.values(store.getState().edges).find(
			item => item.target === id
		)
		const sourceId = edge !== undefined ? edge.source : undefined

		// if the user has created a valid edge, then we update the fileMap
		if (sourceId !== undefined) {
			// structuredClone() used for deep cloning of file source
			const file = structuredClone(store.getState().fileMap[sourceId])

			if (file !== undefined && file?.data.length > 0) {
				setError('')
				// store the all column to the keys state
				setKeys(Object.keys(store.getState().fileMap[sourceId].data[0]))
				// deletes the selected columns from the file
				for (var row in file.data) {
					for (const column of selectedColumns) {
						delete file.data[row][column]
						 
					}
				}
				for(var field in file.meta.fields)
				{ 
					for(const column of selectedColumns){
						if(file.meta.fields[field] === column){
							delete file.meta.fields[field]
						}
					}
				}				
				store.getState().storeFile(id, file)
			} else {
				setKeys([])
				setError('data source has no data')
			}
		} else {
			setKeys([])
			setError('connect a data source to select columns')
		}
	}, [selectedColumns, id, selected, data])

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
					id={`drop-in`}
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
					<HeaderLayout title='Drop' id={id} />
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
								<Typography
									fontSize={11}
									sx={{ color: 'primary.contrastText' }}>
									Select Columns to Drop
								</Typography>
								<ToggleButtonGroup
									className='nodrag'
									value={selectedColumns}
									onChange={handleSelected}
									aria-label='data columns'
									color='success'
									sx={{
										display: 'grid',
										gridTemplateColumns: 'repeat(2, 1fr)',
										gap: '6px',
										width: '100%',
									}}>
									{keys.map((item, index) => (
										<ToggleButton
											size='small'
											key={index}
											value={item}
											aria-label={item}
											sx={{
												color: 'primary.contrastText',
												overflow: 'hidden',
												fontWeight: '300',
												fontSize: '8px',
												borderRadius: '0px!important',
												backgroundColor: 'primary.light',
												'&.Mui-selected': {
													color: 'primary.darkText',
													borderColor: 'primary.light !important',
												},
											}}>
											{item}
										</ToggleButton>
									))}
								</ToggleButtonGroup>
							</>
						) : (
							<Typography>{error}</Typography>
						)}
					</Box>
				</Stack>
			</Card>
			<Box
				sx={{
					height: '15px',
					width: 15,
					backgroundColor: 'primary.light',
					borderRadius: '0px 15px 15px 0px',
				}}>
				<Handle
					type='source'
					position='right'
					id={`drop-out`}
					key={`${id}-out`}
					style={{
						left: '91%',
						width: '15px',
						top: '50%',
						height: '15px',
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

export default memo(DropColumnNode)
