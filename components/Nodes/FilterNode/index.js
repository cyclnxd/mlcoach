import React, { useState, useRef, useEffect, memo } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import store from '../../../store/store.ts'
import { Handle } from 'react-flow-renderer'
import { Card, Stack, Typography } from '@mui/material'
import HeaderLayout from '../HeaderLayout'

function FilterNode({ id, selected }) {
	const [fileMetaData, setFileMetaData] = useState(null)
	const [fileData, setFileData] = useState()
	const inputRef = useRef()

	useEffect(() => {
		store.getState().storeFile(id, fileData)
	}, [fileData, id])

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
					id={`filter-in`}
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
					border: '0.5px solid ',
					borderColor: `${selected ? 'primary.light' : 'primary.darkLight'}`,
				}}>
				<Stack spacing={0}>
					<HeaderLayout title='Filter' id={id} />
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							padding: '10px',
							gap: '10px',
						}}>
						{fileData === undefined ? (
							<>
								<Button
									variant='contained'
									component='label'
									value='Upload'
									size='small'
									sx={{
										backgroundColor: 'primary.light',
										'&:hover': {
											backgroundColor: 'primary.darkLight',
										},
									}}>
									Upload
									<input
										id='contained-button-file'
										type='file'
										hidden
										ref={inputRef}
										className='nodrag'
										onChange={() => {
											readFile(inputRef.current.files[0])
										}}
									/>
								</Button>
								<Typography
									component={'div'}
									fontSize={9}
									sx={{
										color: 'primary.darkText',
									}}>
									allowed types csv, excel
								</Typography>
							</>
						) : (
							<Stack spacing={2} alignItems='center' justifyContent='center'>
								<Typography fontSize='12px' color='primary.darkText'>
									<strong>name: </strong>
									{fileMetaData.name}
								</Typography>
								<Typography fontSize='12px' color='primary.darkText'>
									<strong>size: </strong>
									{fileMetaData.size} bytes
								</Typography>
								<Typography fontSize='12px' color='primary.darkText'>
									<strong>type: </strong>
									{fileMetaData.type}
								</Typography>
							</Stack>
						)}
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
					id={`filter-out`}
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

export default memo(FilterNode)
