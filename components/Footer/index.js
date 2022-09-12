import { Box, Typography } from '@mui/material'
import React, { useState, useEffect, useRef } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import store from '../../store/store.ts'
import { Stack } from '@mui/system'
function Footer() {
	//store da seçilen node tutmak için
	const [selectedNode, setSelectedNode] = useState()
	const [fileMap, setFileMap] = useState()
	//okunan dosyanın satır ve sutünlarını footer a verebilmek için
	const [gridRows, setGridRows] = useState([])
	const [gridColumns, setGridColumns] = useState([])
	// useState kullanınca bir önceki seçilen satır ve sutünları renderlıyor o yüzden use ref kullanarak ilk seçilenleri kaydediyor
	const prevRows = useRef(gridRows)
	const prevCol = useRef(gridColumns)

	// sayfayı yeniden render almadan store içerisinde ki verileri subscribe ile çekip komponentin içerisine usestate veya benzeri hook ile kaydedersek useef rahatlıkla çalışıyor o yüzden bu var :D
	store.subscribe(() => {
		setSelectedNode(store.getState().clickedNode)
		setFileMap(store.getState().fileMap[store.getState().clickedNode])
	})
	useEffect(() => {
		//footer da tıklanan node boşsa ilk dosya yüklenen nodun datalarını gösterdiği için bunu ekledim
		if (store.getState().clickedNode === -1) {
			prevCol.current = []
			prevRows.current = []
		} else {
			//satır ve sutünlar okunuyor
			// console.log(store.getState().fileMap[1])
			if (fileMap !== undefined) {
				//max satır sayısını belirliyor
				let numRows

				numRows = fileMap.data.length

				const newCols = []
				for (var i = 0; i < fileMap.meta.fields.length; i++) {
					newCols.push({
						field: fileMap.meta.fields[i],
						headerName: fileMap.meta.fields[i],
						flex: 1,
						maxWidth: 200,
						minWidth: 200,
					})
				}
				const newRows = []
				for (var j = 1; j < numRows; j++) {
					const newRow = fileMap.data[j]
					newRows.push({ ...newRow, id: j })
				}
				//kaydediliyor
				setGridColumns(newCols)
				setGridRows(newRows)
				prevRows.current = newRows
				prevCol.current = newCols
			}
		}
	}, [fileMap, selectedNode])
	return (
		<Box
			sx={{
				backgroundColor: 'primary.main',
				color: 'primary.contrastText',
				height: '100%',
				width: '100%',
				border: '1px solid',
				borderColor: 'primary.light',
			}}>
			<Stack
				sx={{
					height: '100%',
					width: '100%',
				}}>
				<Box
					sx={{
						borderBottom: '1px solid',
						borderColor: 'primary.light',
					}}>
					<Typography
						fontSize={13}
						component='div'
						sx={{
							color: 'primary.contrastText',
							m: 1,
							fontWeight: 'bold',
						}}>
						OUTPUT
					</Typography>
				</Box>
				{store.getState().clickedNode !== -1 && prevRows.current.length > 0 ? (
					<DataGrid
						rows={prevRows.current}
						columns={prevCol.current}
						disableSelectionOnClick
						density='compact'
						disableColumnMenu
						showColumnRightBorder
						rowsPerPageOptions={[5, 10, 50, 100, prevRows.current.length]}
						headerHeight={36}
						rowHeight={36}
						sx={{
							color: 'primary.contrastText',
							border: 'none',
							fontSize: 11,
							'.MuiDataGrid-footerContainer': {
								border: 'none',
								height: '30px',
								minHeight: '30px',
								'.MuiTablePagination-root': {
									color: 'primary.contrastText',
								},
								'.Mui-disabled': {
									color: '#ffffff1a',
								},
								'.MuiSelect-icon': {
									color: 'primary.contrastText',
								},
							},
							'.MuiDataGrid-cell': {
								borderRight: '1px solid',
								borderColor: 'primary.darkLight',
							},
							'.MuiDataGrid-columnHeader': {
								backgroundColor: 'primary.darkLight',
								borderColor: 'primary.light',
								borderRadius: '0px',
							},
							'.MuiDataGrid-columnHeaders': {
								borderBottom: '1px solid',
								borderColor: 'primary.light',
							},
							'.MuiDataGrid-columnHeaderTitle': {
								fontSize: 12,
								fontWeight: 'bold',
							},
						}}
					/>
				) : (
					<></>
				)}
			</Stack>
		</Box>
	)
}

export { Footer }
