import { Box, Typography, Stack, Autocomplete } from '@mui/material'
import { useState, useEffect, useRef, memo } from 'react'

import store from 'lib/store/store.ts'
import { Dialog, DialogTitle, Paper, Grid } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

import PlotGraph from './PlotGraph'
import Button from '@mui/material/Button'
import localforage from 'localforage'
import { unstable_batchedUpdates } from 'react-dom'

const checkedIcon = <CheckBoxIcon fontSize='small' />
const icon = <CheckBoxOutlineBlankIcon fontSize='small' />

let charts = [
	'ScatterChart',
	'AreaChart',
	'BarChart',
	'LineChart',
	'PieChart',
	'BubbleChart',
	'ColumnChart',
	'Histogram',
]
let axisChanged = false
let chartType = 'ScatterChart'
let chartParams = { title: 'deneme', subtitle: 'deneme' }
let axisParams = {
	xAxis: { title: ' ', minValue: 0, maxValue: 0 },
	yAxis: { title: ' ', minValue: 0, maxValue: 0 },
}
function Graph({ onDelete, isDisplay, parentDimensions }) {
	const [openDialog, setOpenDialog] = useState(false)

	const [render, setRender] = useState(false)
	const [fileMap, setFileMap] = useState()
	const prevCol = useRef([])

	const dialogHandler = () => {
		setOpenDialog(!openDialog)
	}

	const clickedNodeRef = useRef(store.getState().clickedNode)
	const fileMapRef = useRef(store.getState().fileMap)

	useEffect(() => {
		const sub = store.subscribe(() => {
			const state = store.getState()
			if (
				state.clickedNode !== clickedNodeRef.current ||
				JSON.stringify(state.fileMap) !== JSON.stringify(fileMapRef.current)
			) {
				clickedNodeRef.current = state.clickedNode
				if (state.clickedNode && typeof state.clickedNode === 'string') {
					const id = state.clickedNode
					localforage.getItem(id).then(file => {
						if (file !== undefined && file !== null) {
							const { data, meta } = file
							unstable_batchedUpdates(() => {
								const columns = []
								Object.entries(meta.fields).forEach(([key, value]) => {
									columns.push(value)
								})
								setFileMap(data)
								prevCol.current = columns
								setRender(true)
							})
						}
					})
				} else {
					setRender(false)
				}
			}
		})
		return () => sub()
	}, [render])

	return (
		<Stack sx={{ color: 'primary.dark' }} spacing={0} direction='column'>
			<Box
				sx={{
					border: '1px solid',
					borderBottom: 'none',
					borderColor: 'primary.light',
					fontWeight: 'bold',
					letterSpacing: 1.5,
					color: 'primary.contrastText',
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					width: `${parentDimensions.width * 8.34}vw`,
					zIndex: 5,
					backgroundColor: 'primary.main',
					height: '44px',
				}}>
				<Typography
					fontSize={13}
					component='div'
					color='inherit'
					sx={{
						m: 1,
					}}>
					GRAPH PANEL
				</Typography>
				<Button
					onClick={dialogHandler}
					color='inherit'
					sx={{
						m: 1,
						color: 'primary.contrastText',
						fontSize: 12,
						fontWeight: 'bold',
						letterSpacing: 1.5,
						'&:hover': {
							backgroundColor: 'primary.darkLight',
						},
					}}>
					Open Graph Editor
				</Button>
			</Box>
			{openDialog ? (
				<GraphEditor
					data={fileMap}
					onClose={dialogHandler}
					columns={prevCol.current}
				/>
			) : (
				<></>
			)}
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					height: `${parentDimensions.height * 3.23}vw`,
					width: `${parentDimensions.width * 8.34}vw`,
					backgroundColor: 'primary.main',
					border: '1px solid',
					borderColor: 'primary.light',
				}}>
				{store.getState().clickedNode !== -1 ? (
					<PlotGraph
						data={fileMap}
						chartType={chartType}
						width={parentDimensions.width * 10}
						height={parentDimensions.height * 10}
						chartParams={chartParams}
						axisParams={axisParams}
						update={render}
						axisChanged={axisChanged}
						style={{
							width: '100%',
							height: '100%',
							position: 'absolute',
							top: 0,
							left: 0,
						}}
					/>
				) : (
					<></>
				)}
			</Box>
		</Stack>
	)
}
function GraphEditor({ onClose, columns }) {
	const handleXAxisChange = (event, value) => {
		axisParams.xAxis.title = value
		axisChanged = !axisChanged
	}
	const handleYAxisChange = (event, value) => {
		axisParams.yAxis.title = value
		axisChanged = !axisChanged
	}
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle
				sx={{
					backgroundColor: 'primary.darkLight',
					color: 'primary.contrastText',
				}}>
				Graph Editor
			</DialogTitle>
			<Grid container spacing={2}>
				<Grid sx={{ backgroundColor: 'primary.darkLight' }} item xs={4}>
					<Paper
						elevation={3}
						sx={{
							height: '500px',
							width: '600px',
							backgroundColor: 'primary.darkLight',
						}}>
						<Box
							sx={{
								height: '500px',
								width: '300px',
								display: 'flex',
								flexDirection: 'row',
								backgroundColor: 'primary.darkLight',
								color: 'primary.light',
								border: '1px solid',
							}}>
							<Typography
								sx={{
									width: '300px',
									height: '25px',
									alignItems: 'center',
									justifyContent: 'center',
									display: 'flex',
									variant: 'h2',
									color: 'primary.contrastText',
								}}>
								Chart Properties
							</Typography>
							<Typography
								sx={{
									backgroundColor: 'primary.darkLight',
									marginTop: '50px',
									marginLeft: '-240px',
									color: 'primary.contrastText',
								}}>
								Select X Axis
							</Typography>
							<Autocomplete
								color='primary.contrastText'
								onChange={(event, value) => {
									handleXAxisChange(event, value)
								}}
								sx={{
									backgroundColor: 'primary.darkLight',
									marginTop: '50px',
									marginRight: '25px',
									width: '100px',
								}}
								id='tags-columns'
								options={columns}
								disableCloseOnSelect
								getOptionLabel={columns => columns}
								renderOption={(props, columns, { selected }) => (
									<li {...props}>
										<Checkbox
											icon={icon}
											checkedIcon={checkedIcon}
											style={{ marginRight: 8 }}
											checked={selected}
										/>
										{columns}
									</li>
								)}
								style={{ width: '200px', color: 'primary.light' }}
								renderInput={params => (
									<TextField
										sx={{ backgroundColor: 'primary.light' }}
										{...params}
										label='X axis'
										placeholder='Columns'
									/>
								)}
							/>
							<Typography
								sx={{
									backgroundColor: 'primary.darkLight',
									marginTop: '125px',
									marginLeft: '-290px',
									color: 'primary.contrastText',
								}}>
								Select Y Axis
							</Typography>
							<Autocomplete
								color='primary.contrastText'
								sx={{
									backgroundColor: 'primary.darkLight',
									marginTop: '125px',
									marginRight: '25px',
									width: '100px',
								}}
								id='tags-columns'
								options={columns}
								disableCloseOnSelect
								getOptionLabel={columns => columns}
								onChange={(event, value) => {
									handleYAxisChange(event, value)
								}}
								renderOption={(props, columns, { selected }) => (
									<li {...props}>
										<Checkbox
											icon={icon}
											checkedIcon={checkedIcon}
											style={{ marginRight: 8 }}
											checked={selected}
										/>
										{columns}
									</li>
								)}
								style={{ width: '200px', color: 'primary.light' }}
								renderInput={params => (
									<TextField
										sx={{ backgroundColor: 'primary.light' }}
										{...params}
										label='Y Axis'
										placeholder='Columns'
									/>
								)}
							/>
							<Typography
								sx={{
									backgroundColor: 'primary.darkLight',
									marginTop: '200px',
									marginLeft: '-290px',
									color: 'primary.contrastText',
								}}>
								Chart Type
							</Typography>
							<Autocomplete
								color='primary.contrastText'
								sx={{
									backgroundColor: 'primary.darkLight',
									marginTop: '200px',
									marginRight: '25px',
									marginLeft: '25px',
									width: '100px',
								}}
								id='tags-columns'
								options={charts}
								disableCloseOnSelect
								getOptionLabel={charts => charts}
								onChange={(event, value) => {
									chartType = value
									axisChanged = !axisChanged
								}}
								renderOption={(props, charts, { selected }) => (
									<li {...props}>
										<Checkbox
											icon={icon}
											checkedIcon={checkedIcon}
											style={{ marginRight: 8 }}
											checked={selected}
										/>
										{charts}
									</li>
								)}
								style={{ width: '200px', color: 'primary.light' }}
								renderInput={params => (
									<TextField
										sx={{ backgroundColor: 'primary.light' }}
										{...params}
										label='Chart Types'
										placeholder='Charts'
									/>
								)}
							/>
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Dialog>
	)
}
export default memo(Graph)
