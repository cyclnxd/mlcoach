import React, { memo, useEffect, useRef, useState } from 'react'
import { Handle } from 'react-flow-renderer'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Papa from 'papaparse'
import Button from '@mui/material/Button'
import { DataGrid } from '@mui/x-data-grid'
import { input } from '@tensorflow/tfjs-node'

const ACCEPTED_FILE_FORMATS =
	'.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
const MAX_ROWS = 5


function StartNode({ data }) {
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
		localStorage.setItem(`${1}_data`, JSON.stringify(fileData))
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
							backgroundColor: '#21415E',
							border: '0.5px solid #627F9A',
							padding: 5,
							minHeight: '100px',
							color: 'white',
						}}>
						<Grid>
							{fileData === undefined ? (
								<>
									<div style={{}}>
										<Box style={{ marginBottom: '10px' }}>
											Please upload a CSV file.
										</Box>
										<input
                    style={{display: 'none'}}
											id='contained-button-file'
											type='file'
											accept={ACCEPTED_FILE_FORMATS}
											ref={inputRef}
											className='nodrag'
											onChange={() => {
												readFile(inputRef.current.files[0])
											}}
										/>
                    <Button onClick={()=>{inputRef.current}}>

                    </Button>
									</div>
								</>
							) : (
								<>
									<Box>Uploaded successful.</Box>
									<Button onClick={() => {}}>View File</Button>
									<div
										style={{
											height: 300,
											width: '100%',
											backgroundColor: '#21415E',
											borderRadius: '3px',
										}}>
										<DataGrid rows={gridRows} columns={gridColumns} />
									</div>
								</>
							)}
						</Grid>
					</Box>
					<Box
						sx={{
							height: 100,
							width: 15,
							backgroundColor: '#21415E',
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

export default memo(StartNode)
