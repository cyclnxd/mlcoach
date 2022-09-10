import { Box } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import create from 'zustand'
import store from '../../store/store.ts'
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
	const selected = store.subscribe(
		() => {
			setSelectedNode(store.getState().clickedNode)
		},
		state => store.getState().clickedNode
	)
	useEffect(() => {
		//footer da tıklanan node boşsa ilk dosya yüklenen nodun datalarını gösterdiği için bunu ekledim
		if(store.getState().clickedNode === -1) {
			prevCol.current = []; prevRows.current = [];
		 }
		else{
		//satır ve sutünlar okunuyor
			// console.log(store.getState().fileMap[1])
		if (store.getState().fileMap[selectedNode] !== undefined) {
			//max satır sayısını belirliyor
			let numRows;
			if(store.getState().fileMap[selectedNode].data.length > MAX_ROWS){ numRows = MAX_ROWS;}
			else{ numRows = store.getState().fileMap[selectedNode].data.length;}

			const newCols = []
			for (
				var i = 0;
				i < store.getState().fileMap[selectedNode].meta.fields.length;
				i++
			) {
				newCols.push({
					field: store.getState().fileMap[selectedNode].meta.fields[i],
					headerName: store.getState().fileMap[selectedNode].meta.fields[i],
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
		<Grid2
			container
			sx={{
				height: '100%',
				width: '100%',
			}}>
			<Grid2 item xs={16}>
				<Box
					sx={{
						backgroundColor: 'primary.main',
						color: 'primary.contrastText',
						height: '100%',
						width: '100%',
						border: '1px solid #413f66',
					}}>
					{store.getState().clickedNode !== -1 ? (
						<DataGrid
							rows={prevRows.current}
							columns={prevCol.current}
							sx={{  }}
						/>
					) : (
						<></>
					)}
				</Box>
			</Grid2>
		</Grid2>
	)
}

export { Footer }