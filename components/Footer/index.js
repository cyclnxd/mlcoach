import { Box, Typography } from '@mui/material'
import React, { useState, useEffect, useRef } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import store from '../../store/store.ts'
import { height, Stack } from '@mui/system'
const MAX_ROWS = 400
function Footer() {
	//store da seçilen node tutmak için
	const [selectedNode, setSelectedNode] = useState()
	//okunan dosyanın satır ve sutünlarını footer a verebilmek için
	const [gridRows, setGridRows] = useState([])
	const [gridColumns, setGridColumns] = useState([])
	// useState kullanınca bir önceki seçilen satır ve sutünları renderlıyor o yüzden use ref kullanarak ilk seçilenleri kaydediyor
	const prevRows = useRef(gridRows)
	const prevCol = useRef(gridColumns)
	// sayfayı yeniden render almadan store içerisinde ki verileri subscribe ile çekip komponentin içerisine usestate veya benzeri hook ile kaydedersek useef rahatlıkla çalışıyor o yüzden bu var :D
	store.subscribe(
		() => {
			setSelectedNode(store.getState().clickedNode)
		},
		state => store.getState().clickedNode
	)
	useEffect(() => {
		//footer da tıklanan node boşsa ilk dosya yüklenen nodun datalarını gösterdiği için bunu ekledim
		if (store.getState().clickedNode === -1) {
			prevCol.current = []
			prevRows.current = []
		} else {
			//satır ve sutünlar okunuyor
			// console.log(store.getState().fileMap[1])
			if (store.getState().fileMap[selectedNode] !== undefined) {
				//max satır sayısını belirliyor
				let numRows
				if (store.getState().fileMap[selectedNode].data.length > MAX_ROWS) {
					numRows = MAX_ROWS
				} else {
					numRows = store.getState().fileMap[selectedNode].data.length
				}

				const newCols = []
				for (
					var i = 0;
					i < store.getState().fileMap[selectedNode].meta.fields.length;
					i++
				) {
					newCols.push({
						field: store.getState().fileMap[selectedNode].meta.fields[i],
						headerName: store.getState().fileMap[selectedNode].meta.fields[i],
						flex: 1,
						maxWidth: 200,
					})
				}
				const newRows = []
				for (var j = 1; j < numRows; j++) {
					const newRow = store.getState().fileMap[selectedNode].data[j]
					newRows.push({ ...newRow, id: j })
				}
				//kaydediliyor
				setGridColumns(newCols)
				setGridRows(newRows)
				prevRows.current = newRows
				prevCol.current = newCols
			}
		}
	}, [selectedNode])
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
						headerHeight={36}
						sx={{
							color: 'primary.contrastText',
							border: 'none',
							'.MuiDataGrid-footerContainer': {
								border: 'none',
								height: '30px',
								minHeight: '30px',
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
