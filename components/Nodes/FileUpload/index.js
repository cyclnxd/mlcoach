import React, { useState, useRef, useEffect, memo } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Papa from 'papaparse'
import store from '../../../lib/store/store.ts'
import { Handle } from 'react-flow-renderer'
import { Card, Stack, Typography } from '@mui/material'
import HeaderLayout from '../HeaderLayout'

const ACCEPTED_FILE_FORMATS =
	'.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'

function FileUpload({ id, selected }) {
	const [fileMetaData, setFileMetaData] = useState(null)
	const [fileData, setFileData] = useState()
	const inputRef = useRef()

	const readFile = newFile => {
		setFileMetaData({
			name: newFile.name,
			size: newFile.size,
			type: newFile.type,
		})
		Papa.parse(newFile, {
			complete: result => {
				setFileData(result)
			},
			header: true,
		})
	}
	useEffect(() => {
		store.getState().storeFile(id, fileData)
	}, [fileData, id])

	return (
		<Grid container direction='row' justifyContent='center' alignItems='center'>
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
					<HeaderLayout title='File' id={id} />
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
										accept={ACCEPTED_FILE_FORMATS}
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
					id={'file-out'}
					key={id}
					style={{
						left: 'inherit',
						width: 'inherit',
						top: '50%',
						height: 'inherit',
						background: 'none',
						border: 'none',
						borderRadius: 'inherit',
					}}
					isConnectable={true}
				/>
			</Box>
		</Grid>
	)
}

export default memo(FileUpload)
