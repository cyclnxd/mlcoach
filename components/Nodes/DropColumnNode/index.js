import { useState, useEffect, memo } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import store from 'lib/store/store.ts'
import {
	Card,
	Stack,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from '@mui/material'
import HeaderLayout from '../HeaderLayout'
import CustomHandle from '../CustomHandle'
import { useTranslations } from 'next-intl'

function DropColumnNode({ id, selected, data }) {
	const e = useTranslations('editor.nodes.errors')
	const dc = useTranslations('editor.nodes.dropColumn')
	// store the columns of DataFrame
	const [keys, setKeys] = useState([])
	// store the selected unique columns
	const [selectedColumns, setSelectedColumns] = useState(() => [])
	const [error, setError] = useState('')
	// takes the selected columns and adds it to end of the Set structure
	const handleSelected = (_, columns) => {
		setSelectedColumns(columns)
	}
	useEffect(() => {
		const edge = Object.values(store.getState().edges).find(
			item => item.target === id
		)
		const sourceId = edge !== undefined ? edge.source : undefined

		// if the user has created a valid edge, then we update the fileMap
		if (sourceId !== undefined) {
			// structuredClone() used for deep cloning of file source
			const file = structuredClone(store.getState().fileMap[sourceId])

			if (file !== undefined && file?.data.length > 0) {
				setError('')
				// store the all column to the keys state
				setKeys(Object.keys(store.getState().fileMap[sourceId].data[0]))
				// deletes the selected columns from the file
				for (var row in file.data) {
					for (const column of selectedColumns) {
						delete file.data[row][column]
					}
				}
				for (var field in file.meta.fields) {
					for (const column of selectedColumns) {
						if (file.meta.fields[field] === column) {
							delete file.meta.fields[field]
						}
					}
				}
				store.getState().storeFile(id, file)
			} else {
				setKeys([])
				setError(e('noData'))
			}
		} else {
			store.getState().storeFile(id, undefined)
			setKeys([])
			setError(e('noConnection'))
		}
	}, [selectedColumns, id, selected, data, e])

	return (
		<Grid container direction='row' justifyContent='center' alignItems='center'>
			<CustomHandle
				type='target'
				position='left'
				id={`drop-in`}
				key={`drop-${id}-in`}
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
					<HeaderLayout title={dc('name')} id={id} />
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
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
							<>
								<Typography
									fontSize={11}
									sx={{ color: 'primary.contrastText' }}>
									{dc('content')}
								</Typography>
								<ToggleButtonGroup
									className='nodrag'
									value={selectedColumns}
									onChange={handleSelected}
									aria-label='data columns'
									color='success'
									sx={{
										display: 'grid',
										gridTemplateColumns: 'repeat(2, 1fr)',
										gap: '6px',
										width: '100%',
									}}>
									{keys.map((item, index) => (
										<ToggleButton
											size='small'
											key={index}
											value={item}
											aria-label={item}
											sx={{
												color: 'primary.contrastText',
												overflow: 'hidden',
												fontWeight: '300',
												fontSize: '8px',
												borderRadius: '0px!important',
												backgroundColor: 'primary.light',
												'&.Mui-selected': {
													color: 'primary.darkText',
													borderColor: 'primary.light !important',
												},
											}}>
											{item}
										</ToggleButton>
									))}
								</ToggleButtonGroup>
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
				id={`drop-out`}
				key={`drop-${id}-out`}
				isConnectable={true}
				onConnect={params => handleConnect(params)}
			/>
		</Grid>
	)
}

export default memo(DropColumnNode)
