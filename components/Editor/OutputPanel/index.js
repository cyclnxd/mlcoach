import { Box, Typography, Stack } from '@mui/material'
import { useState, useEffect, useRef, memo } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import store from 'lib/store/store.ts'
import StormIcon from '@mui/icons-material/Storm'
import localforage from 'localforage'
import { unstable_batchedUpdates } from 'react-dom'

function OutputPanel({ onDelete, isDisplay }) {
	const [render, setRender] = useState(false)
	// useState kullanınca bir önceki seçilen satır ve sutünları renderlıyor o yüzden use ref kullanarak ilk seçilenleri kaydediyor
	const prevRows = useRef([])
	const prevCol = useRef([])
	const clickedNodeRef = useRef(store.getState().clickedNode)
	const fileMapRef = useRef(store.getState().fileMap)
	useEffect(() => {
		const sub = store.subscribe(() => {
			const state = store.getState()
			if (
				state.clickedNode !== clickedNodeRef.current ||
				JSON.stringify(state.fileMap) !== JSON.stringify(fileMapRef.current)
			) {
				fileMapRef.current = state.fileMap
				clickedNodeRef.current = state.clickedNode
				if (state.clickedNode && typeof state.clickedNode === 'string') {
					const id = state.clickedNode
					localforage.getItem(id).then(file => {
						if (file !== undefined && file !== null) {
							const { data, meta } = file
							unstable_batchedUpdates(() => {
								//max satır sayısını belirliyor
								let numRows
								numRows = data.length
								const newCols = []
								for (var i = 0; i < meta.fields.length; i++) {
									if (meta.fields[i] !== undefined) {
										newCols.push({
											field: meta.fields[i],
											headerName: meta.fields[i],
											flex: 1,
											maxWidth: 200,
											minWidth: 200,
										})
									}
								}
								const newRows = []
								for (var j = 1; j < numRows; j++) {
									const newRow = data[j]
									newRows.push({ ...newRow, id: j })
								}
								//kaydediliyor
								prevRows.current = newRows
								prevCol.current = newCols
								setRender(true)
							})
						} else {
							setRender(true)
							//eğer dosya map undefined ise önceki satır ve sutünları gösteriyor
							prevRows.current = []
							prevCol.current = []
						}
					})
				}
				setRender(false)
			}
		})
		return () => {
			sub()
		}
	}, [render])
	return (
		<Box
			sx={{
				backgroundColor: 'primary.main',
				color: 'primary.contrastText',
				height: '100%',
				width: '100%',
				border: '1px solid',
				borderColor: 'primary.light',
				display: isDisplay ? 'block' : 'none',
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
						fontWeight: 'bold',
						letterSpacing: 1.5,
						color: 'primary.contrastText',
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						height: '44px',
					}}>
					<Typography
						fontSize={13}
						component='div'
						color='inherit'
						sx={{
							m: 1,
						}}>
						OUTPUT
					</Typography>
					<StormIcon
						onClick={onDelete}
						fontSize='inherit'
						color='inherit'
						sx={{
							m: 1,
							cursor: 'pointer',
							opacity: 0.5,
							'&:hover': {
								color: 'primary.darkText',
								opacity: 1,
							},
						}}
					/>
				</Box>
				{store.getState().clickedNode !== -1 && prevRows.current.length > 0 ? (
					<DataGrid
						className='nodrag'
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
							userSelect: 'none',
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

export default memo(OutputPanel)
