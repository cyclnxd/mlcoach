import { useState, useEffect, memo, useRef } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import store from 'lib/store/store.ts'
import {
	Card,
	Stack,
	Typography,
	Autocomplete,
	Button,
	Pagination,
} from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import SimpleImputation from 'lib/utils/simpleImputation'

const checkedIcon = <CheckBoxIcon fontSize='small' />
const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
import HeaderLayout from '../../HeaderLayout'
import CustomHandle from 'components/Nodes/CustomHandle'

function FillWithStatsNode({ id, selected, data }) {
	const [columns, setColumns] = useState(() => [])
	const [selectedColumn, setSelectedColumn] = useState(() => [])
	const prevSelectedColumn = useRef(selectedColumn)

	const [error, setError] = useState('connect a data source to select columns')

	const keys = ['Minimum', 'Maximum', 'Mean', 'Median']
	const [selectedKey, setSelectedKey] = useState('Mean')

	const [startImputation, setStartImputation] = useState('true')
	const [fileChanged, setFileChanged] = useState(false)
	const [page, setPage] = useState(1)
	const handlePagination = (event, Page) => {
		setPage(Page)
	}

	const handleButtonClick = event => {
		let value = startImputation !== 'true' ? 'true' : 'false'
		setStartImputation(value)
	}

	const handleKeyChange = (event, value) => {
		setSelectedKey(value)
	}

	const handleColumnChange = (event, value) => {
		prevSelectedColumn.current = value
		setSelectedColumn(prevSelectedColumn.current)
	}

	const [maximum, setMaximum] = useState(-1)
	const [minimum, setMinimum] = useState(-1)
	const [mean, setMean] = useState(-1)
	const [median, setMedian] = useState(-1)

	useEffect(() => {
		// checking if the user has created a valid edge between two nodes
		const edge = Object.values(store.getState().edges).find(
			item => item.target === id
		)
		const sourceId = edge !== undefined ? edge.source : undefined
		if (sourceId !== undefined) {
			let file =
				store.getState().fileMap[id] === undefined
					? structuredClone(store.getState().fileMap[sourceId])
					: structuredClone(store.getState().fileMap[id])
			if (file !== undefined && file?.data.length > 0) {
				setError('')
				file = {
					...file,
					data: file.data,
				}
				var set = new Set()
				for (const column of Object.keys(file.data[0])) {
					for (var index in file.data) {
						if (!file.data[index][column]) {
							set.add(column)
						}
					}
				}
				setColumns([...set])
				setSelectedColumn(prevSelectedColumn.current)
				if (page === 1) {
					switch (selectedKey) {
						case 'Median':
							{
								if (selectedColumn !== null) {
									for (const column of selectedColumn) {
										let imputation = new SimpleImputation('Median')
										imputation.transformData(column, file.data)
									}
								}
							}
							break

						case 'Mean':
							{
								if (selectedColumn !== null) {
									for (const column of selectedColumn) {
										let imputation = new SimpleImputation('Mean')
										imputation.transformData(column, file.data)
									}
								}
							}
							break

						case 'Maximum':
							{
								if (selectedColumn !== null) {
									for (const column of selectedColumn) {
										let imputation = new SimpleImputation('Maximum')
										imputation.transformData(column, file.data)
									}
								}
							}
							break
						case 'Minimum':
							{
								if (selectedColumn !== null) {
									let imputation = new SimpleImputation('Minimum')
									for (const column of selectedColumn) {
										imputation.transformData(column, file.data)
									}
								}
							}
							break
						default:
					}
				} else {
					if (selectedColumn !== null) {
						for (const key of keys) {
							let imputation = new SimpleImputation(key)
							imputation.transformData(selectedColumn, file.data)
							if (key === 'Maximum') {
								console.log(Number.MIN_VALUE)
								setMaximum(imputation.getMaximum())
							} else if (key === 'Minimum') {
								setMinimum(imputation.getMinimum())
							} else if (key === 'Mean') {
								setMean(imputation.getMean())
							} else if (key === 'Median') {
								setMedian(imputation.getMedian())
							}
						}
					}
				}
				startImputation === 'true'
					? store.getState().storeFile(id, file)
					: startImputation === 'true'
					? setFileChanged(true)
					: setFileChanged(false)
				setStartImputation('false')
			} else {
				setError('data source has no data')
			}
		} else {
			store.getState().storeFile(id, undefined)
			setError('connect a data source to slice data')
		}
	}, [
		id,
		data,
		selectedColumn,
		selectedKey,
		startImputation,
		fileChanged,
		page,
	])

	function mainBody(page) {
		if (page === 1) {
			return (
				<>
					<Typography fontSize={11} sx={{ color: 'primary.contrastText' }}>
						Fill data with selected mode
					</Typography>

					<Autocomplete
						multiple
						id='tags-columns'
						options={columns}
						disableCloseOnSelect
						getOptionLabel={columns => columns}
						onChange={(event, value) => handleColumnChange(event, value)}
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
						style={{ width: '170px', color: 'primary.light' }}
						renderInput={params => (
							<TextField
								sx={{ color: 'primary.light' }}
								{...params}
								label='Column Box'
								placeholder='Columns'
							/>
						)}
					/>

					<Autocomplete
						id='tags-statistic'
						options={keys}
						getOptionLabel={keys => keys}
						onChange={(event, value) => handleKeyChange(event, value)}
						style={{ width: '170px', color: 'primary.light' }}
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
						renderInput={params => (
							<TextField
								sx={{ color: 'primary.light' }}
								{...params}
								label='Variables Box'
								placeholder='Columns'
							/>
						)}
					/>
					<Button
						variant='contained'
						value={startImputation}
						onClick={() => handleButtonClick()}
						sx={{
							color: 'primary.contrastText',
							overflow: 'hidden',
							fontWeight: '300',
							fontSize: '10px',
							borderRadius: '0px!important',
							backgroundColor: 'primary.light',
							'&.Mui-selected': {
								color: 'primary.darkText',
								borderColor: 'primary.light !important',
							},
						}}>
						Imput Selected Columns
					</Button>
					<Pagination
						page={page}
						onChange={handlePagination}
						count={2}
						variant='outlined'
						shape='rounded'
					/>
				</>
			)
		} else {
			return (
				<>
					<Autocomplete
						id='tags-columns'
						options={columns}
						disableCloseOnSelect
						getOptionLabel={columns => columns}
						onChange={(event, value) => handleColumnChange(event, value)}
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
						style={{ width: '170px', color: 'primary.light' }}
						renderInput={params => (
							<TextField
								sx={{ color: 'primary.light' }}
								{...params}
								label='Column Box'
								placeholder='Columns'
							/>
						)}
					/>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'left',
							alignItems: 'left',
							pl: '0px',
							gap: '5px',
						}}>
						<Typography>
							Mean {mean !== Infinity ? mean.toFixed(2) : 0}{' '}
						</Typography>
						<Typography>
							Median {median !== 1.7976931348623157e308 ? median : 0}
						</Typography>
						<Typography>
							Maximum {maximum !== 1.7976931348623157e308 ? maximum : 0}
						</Typography>
						<Typography>
							Minimum {minimum !== 1.7976931348623157e308 ? minimum : 0}
						</Typography>
					</Box>
					<Pagination
						page={page}
						onChange={handlePagination}
						count={2}
						variant='outlined'
						shape='rounded'
					/>
				</>
			)
		}
	}
	return (
		<Grid container direction='row' justifyContent='center' alignItems='center'>
			<CustomHandle
				type='target'
				position='left'
				id={`fwsn-in`}
				key={`fwsn-${id}-in`}
				isConnectable={true}
			/>
			<Card
				sx={{
					backgroundColor: 'primary.surface',
					color: 'white',
				}}
				style={
					selected
						? { border: '0.5px solid #403f69' }
						: { border: '0.5px solid #333154' }
				}>
				<Stack spacing={1}>
					<HeaderLayout title='Statistic Filling' id={id} />
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							padding: '10px',
							gap: '10px',
							width: '200px',
							'.MuiOutlinedInput-root': {
								color: 'primary.contrastText',
								fontSize: '12px',
							},
							'& label': {
								color: 'primary.contrastText',
								fontSize: '12px',
							},
							'& label.Mui-focused': {
								color: 'primary.contrastText',
							},
							'& .MuiInput-underline:after': {
								borderBottomColor: 'green',
							},
							'& .MuiOutlinedInput-root': {
								'& fieldset': {
									borderColor: 'primary.darkLight',
								},
								'&:hover fieldset': {
									borderColor: 'primary.light',
								},
								'&.Mui-focused fieldset': {
									borderColor: 'primary.light',
								},
							},
						}}>
						{error.length === 0 ? (
							mainBody(page)
						) : (
							<Typography>{error}</Typography>
						)}
					</Box>
				</Stack>
			</Card>
			<CustomHandle
				type='source'
				position='right'
				id={`fwsn-out`}
				key={`fwsn-${id}-out`}
				isConnectable={true}
			/>
		</Grid>
	)
}
export default memo(FillWithStatsNode)
