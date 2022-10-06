import { useState, useEffect, memo } from 'react'
import Box from '@mui/material/Box'
import { Autocomplete, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import store from 'lib/store/store.ts'
import { Card, Stack } from '@mui/material'
import HeaderLayout from '../HeaderLayout'
import CustomHandle from '../CustomHandle'

const filterList = {
	text: [
		'equals',
		'not equals',
		'contains',
		'not contains',
		'starts with',
		'ends with',
		'is null',
		'is not null',
		'regex',
	],
	number: [
		'equals',
		'not equals',
		'greater than',
		'greater than or equal',
		'less than',
		'less than or equal',
		'is null',
		'is not null',
		'regex',
	],
	boolean: ['equals', 'not equals', 'is null', 'is not null'],
}

function FilterNode({ id, selected, data }) {
	const [error, setError] = useState('connect a data source to select columns')
	const [selectedColumn, setSelectedColumn] = useState(null)
	const [selectedFilter, setSelectedFilter] = useState(null)
	const [columns, setColumns] = useState([])
	const [filters, setFilters] = useState([])
	const [types, setTypes] = useState([])
	const [value, setValue] = useState('')

	useEffect(() => {
		const edge = Object.values(store.getState().edges).find(
			item => item.target === id
		)
		const sourceId = edge !== undefined ? edge.source : undefined
		if (sourceId !== undefined) {
			let file = structuredClone(store.getState().fileMap[sourceId])
			if (file !== undefined && file?.data.length > 0) {
				setColumns(file.meta.fields)
				setTypes(file.data[0])
				setError('')
				store.getState().storeFile(id, file)
			} else {
				setError('data source has no data')
			}
		} else {
			store.getState().storeFile(id, undefined)
			setError('connect a data source to slice data')
		}
	}, [id, data])

	return (
		<Grid container direction='row' justifyContent='center' alignItems='center'>
			<CustomHandle
				type='target'
				position='left'
				id={`filter-in`}
				key={`filter-${id}-in`}
				isConnectable={true}
			/>
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
				<Stack spacing={1}>
					<HeaderLayout title='Filter Node' id={id} />
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'start',
							alignItems: 'start',
							padding: '10px',
							gap: '15px',
							width: '200px',
						}}>
						{error.length === 0 ? (
							<>
								<Typography
									variant='h6'
									component='div'
									sx={{
										color: 'primary.darkText',
										fontWeight: 'bold',
										fontSize: '12px',
									}}>
									Select column:
								</Typography>
								<Autocomplete
									fullWidth
									options={columns}
									getOptionLabel={option => option}
									value={selectedColumn}
									sx={{
										'& .MuiAutocomplete-popupIndicator': {
											color: 'primary.darkText',
										},
										'& .MuiAutocomplete-clearIndicator': {
											color: 'primary.darkText',
										},
										'& .MuiAutocomplete-clearIndicatorDirty': {
											color: 'primary.darkText',
										},
									}}
									onChange={(_, newValue) => {
										setSelectedColumn(newValue)
										// secilen kolonun tipine gore filtreler set edildi
										switch (types[newValue]) {
											case 'DOUBLE':
											case 'FLOAT':
											case 'INT':
											case 'LONG':
											case 'SHORT':
												setFilters(filterList.number)
												break
											case 'BOOLEAN':
												setFilters(filterList.boolean)
												break
											case 'DATE':
											case 'STRING':
											case 'TEXT':
												setFilters(filterList.text)
												break
											default:
												setFilters([])

												setSelectedFilter(null)
												break
										}
									}}
									renderInput={params => (
										<TextField
											className='nodrag'
											{...params}
											variant='outlined'
											label='Columns'
											sx={{
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
											}}
										/>
									)}
								/>
								<Typography
									variant='h6'
									component='div'
									sx={{
										color: 'primary.darkText',
										fontWeight: 'bold',
										fontSize: '12px',
									}}>
									Select filter:
								</Typography>
								<Autocomplete
									fullWidth
									options={filters}
									getOptionLabel={option => option}
									value={selectedFilter}
									sx={{
										'& .MuiAutocomplete-popupIndicator': {
											color: 'primary.darkText',
										},
										'& .MuiAutocomplete-clearIndicator': {
											color: 'primary.darkText',
										},
										'& .MuiAutocomplete-clearIndicatorDirty': {
											color: 'primary.darkText',
										},
									}}
									onChange={(_, newValue) => {
										setSelectedFilter(newValue)
									}}
									renderInput={params => (
										<TextField
											className='nodrag'
											{...params}
											variant='outlined'
											label='Filters'
											sx={{
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
											}}
										/>
									)}
								/>
								{selectedFilter && (
									<>
										<TextField
											className='nodrag'
											fullWidth
											label='Value'
											variant='outlined'
											value={value}
											onChange={e => setValue(e.target.value)}
											sx={{
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
											}}
										/>
									</>
								)}
							</>
						) : (
							<Typography>{error}</Typography>
						)}
					</Box>
				</Stack>
			</Card>

			<CustomHandle
				type='source'
				position='right'
				id={`filter-out`}
				key={`filter-${id}-out`}
				isConnectable={true}
			/>
		</Grid>
	)
}

export default memo(FilterNode)
