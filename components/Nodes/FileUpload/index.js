import React, { useState, useRef, useEffect, memo } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Papa from 'papaparse'
import store from '../../../store/store.ts'
import { Handle } from 'react-flow-renderer'
import { Card, Stack, Typography } from '@mui/material'
import HeaderLayout from '../HeaderLayout'
import Zoom from '@mui/material/Zoom'

const ACCEPTED_FILE_FORMATS =
	'.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'

function FileUpload({ id, selected }) {
	const [nodeState, setNodeState] = useState(true)
	const [fileMetaData, setFileMetaData] = useState(null)
	const [fileData, setFileData] = useState()
	const inputRef = useRef()

	const handleDelete = () => {
		store.getState().onNodesChange([{ id: id, type: 'remove' }])
	}

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
				}}
				style={
					selected
						? { border: '0.5px solid #403f69' }
						: { border: '0.5px solid #333154' }
				}>
				<Stack spacing={0}>
					<HeaderLayout title='File' onDelete={handleDelete} />
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
										color: '#c5cbd2',
									}}>
									allowed types csv, excel
								</Typography>
							</>
						) : (
							<Stack spacing={2} alignItems='center' justifyContent='center'>
								<Typography fontSize='12px' color='#c5cbd2'>
									<strong>name: </strong>
									{fileMetaData.name}
								</Typography>
								<Typography fontSize='12px' color='#c5cbd2'>
									<strong>size: </strong>
									{fileMetaData.size} bytes
								</Typography>
								<Typography
									fontSize='12px'
									color='#c5cbd2'
									textOverflow='ellipsis'>
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

export default memo(FileUpload)