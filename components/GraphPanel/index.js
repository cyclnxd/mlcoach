import { Button, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { memo } from 'react'
import { useState } from 'react'
import { Chart } from 'react-google-charts'
let array = [['X', 'Y']]
Array.from({ length: 100 }, () => {
	array.push([Math.random(), Math.random()])
})
function GraphPanel({ parentDimensions }) {
	const [chartType, setChartType] = useState('ScatterChart')

	const handleChangeType = () => {
		setChartType(prev =>
			prev === 'ScatterChart' ? 'BarChart' : 'ScatterChart'
		)
	}

	return (
		<Stack spacing={0} direction='column'>
			<Box
				sx={{
					border: '1px solid',
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
					backgroundColor: 'primary.dark',
					mb: 2,
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
					onClick={handleChangeType}
					sx={{
						m: 1,
						color: 'primary.contrastText',
						fontSize: 12,
						fontWeight: 'bold',
						letterSpacing: 1.5,
						'&:hover': {
							backgroundColor: 'primary.light',
						},
					}}>
					Change type
				</Button>
			</Box>

			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					height: parentDimensions.width,
					width: parentDimensions.height,
					backgroundColor: 'primary.darkLight',
				}}>
				<Chart
					chartType={chartType}
					data={array}
					width={parentDimensions.width * 10}
					height={parentDimensions.height * 10}
					legendToggle
					style={{
						width: '100%',
						height: '100%',
						position: 'absolute',
						top: 0,
						left: 0,
					}}
				/>
			</Box>
		</Stack>
	)
}

export default memo(GraphPanel)
