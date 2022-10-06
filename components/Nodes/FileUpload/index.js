import React, { useState, useRef, useEffect, memo } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Papa from 'papaparse'
import { Card, Stack, Typography } from '@mui/material'
import HeaderLayout from '../HeaderLayout'
import CustomHandle from '../CustomHandle'
import localforage from 'localforage'
import store from 'lib/store/store.ts'

const ACCEPTED_FILE_FORMATS =
	'.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'

function FileUpload({ id, selected }) {
	const [fileMetaData, setFileMetaData] = useState(null)
	const [fileUploaded, setFileUploaded] = useState(false)
	const inputRef = useRef()
	const storeFile = store(state => state.storeFile)
	const readFile = newFile => {
		setFileMetaData({
			name: newFile.name,
			size: newFile.size,
			type: newFile.type,
		})
		if (newFile.size <= 10000000) {
			Papa.parse(newFile, {
				header: true,
				dynamicTyping: true,
				fastMode: true,
				complete: result => {
					localforage
						.setItem(id, {
							...result,
							fileMetaData: {
								name: newFile.name,
								size: newFile.size,
								type: newFile.type,
							},
						})
						.then(() => {
							storeFile(id)
							setFileUploaded(true)
						})
						.catch(err => {
							console.log(err)
						})
				},
			})
		} else {
			alert('File size is too large `max 10mb`')
			inputRef.current.value = null
		}
	}
	useEffect(() => {
		async function getFile() {
			const file = await localforage.getItem(id)
			if (file) {
				setFileMetaData(file.fileMetaData)
				setFileUploaded(true)
			}
		}
		getFile()
	}, [id])

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
					maxWidth: '200px',
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
						{!fileUploaded ? (
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
											if (inputRef.current.files[0]) {
												readFile(inputRef.current.files[0])
											}
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
							<Stack spacing={2} alignItems='start' justifyContent='center'>
								<Typography
									fontSize='12px'
									color='primary.darkText'
									sx={{
										wordBreak: 'break-all',
										textOverflow: 'ellipsis',
										overflow: 'hidden',
									}}>
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

			<CustomHandle
				type='source'
				position='right'
				id={'file-out'}
				key={`file-${id}-out`}
				isConnectable={true}
			/>
		</Grid>
	)
}

export default memo(FileUpload)
