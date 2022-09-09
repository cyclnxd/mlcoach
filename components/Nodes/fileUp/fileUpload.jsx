import React, { useState, useRef, useEffect, memo, render } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Papa from 'papaparse'
import { DataGrid } from '@mui/x-data-grid'
import store from '../../../store/store.ts'
import { Handle, Position } from 'react-flow-renderer'
import { Paper, Stack, TextField } from '@mui/material'

const ACCEPTED_FILE_FORMATS =
	'.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
const MAX_ROWS = 5

function FileUpload({ id }, { }) {
	const [fileData, setFileData] = useState()
	const [gridRows, setGridRows] = useState([])
	const [gridColumns, setGridColumns] = useState([])
	const inputRef = useRef()

	const readFile = newFile => {
		Papa.parse(newFile, {
			complete: result => {
				setFileData(result)
			},
			header: true,
		})
	}


	useEffect(() => {

		if (fileData !== undefined) {
			const numRows =
				fileData.data.length > MAX_ROWS ? MAX_ROWS : fileData.data.length
			const newCols = []
			for (var i = 0; i < fileData.meta.fields.length; i++) {
				newCols.push({
					field: fileData.meta.fields[i],
					headerName: fileData.meta.fields[i],
				})
			}
			const newRows = []
			for (var j = 1; j < numRows; j++) {
				const newRow = fileData.data[j]
				newRows.push({ ...newRow, id: j })
			}
			setGridColumns(newCols)
			setGridRows(newRows)
		}
		//   localStorage.setItem(`${props.nodeId}_data`, JSON.stringify(fileData));
		store.getState().storeFile(id, fileData)
	}, [fileData])

	return (
		<>
			<Grid container spacing={0.5} direction='column' alignItems='flex-start'>
				<Grid
					container
					direction='row'
					justifyContent='center'
					alignItems='center'>
					<Box
						sx={{
							backgroundColor: '#3c2a4d',
							border: '0.5px solid #627F9A',
							padding: 5,
							minHeight: '100px',
							color: 'white',
						}}>
						<Grid>
							{fileData === undefined ? (
								<><div style={{}}>
									 
								<Button variant="contained" component="label" sx={{
									height: 25,
									width: "100%",
									backgroundColor: '#402f51',
									borderRadius: '15px 0px 15px 0px',
								}} >Upload new file
									<input

										id='contained-button-file'
										type='file'
										hidden accept={ACCEPTED_FILE_FORMATS}
										ref={inputRef}
										className='nodrag'
										onChange={() => {
											readFile(inputRef.current.files[0])
										}}
									/>
								</Button>
							</div>
									 
								</>
							) : (
								<>
									<Box>Uploaded successful.</Box>
									<Box style={{ marginBottom: '15px' }} />
									<div style={{}}>
									 
										<Button variant="contained" component="label" sx={{
											height: 25,
											width: "100%",
											backgroundColor: '#402f51',
											borderRadius: '15px 0px 15px 0px',
										}} >	Upload new file
											<input

												id='contained-button-file'
												type='file'
												hidden accept={ACCEPTED_FILE_FORMATS}
												ref={inputRef}
												className='nodrag'
												onChange={() => {
													readFile(inputRef.current.files[0])
												}}
											/>
										</Button>
									</div>

								</>
							)}
						</Grid>
					</Box>
					<Box
						sx={{
							height: 100,
							width: 15,
							backgroundColor: '#3c2a4d',
							borderRadius: '0px 15px 15px 0px',
						}}>
						<Handle
							type='source'
							position='right'
							id='a'
							style={{
								width: '20px',
								top: '60%',
								height: '70px',
								background: 'none',
								border: 'none',
							}}
							isConnectable={true}
						/>
					</Box>
				</Grid>
			</Grid>

		</>
	)
}

export default memo(FileUpload)
