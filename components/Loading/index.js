import { CircularProgress } from '@mui/material'
import { Box } from '@mui/system'
import React, { memo } from 'react'

function Loading() {
	return (
		<Box
			sx={{
				width: '100vw',
				height: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}>
			<CircularProgress
				sx={{
					color: 'primary.contrastText',
				}}
			/>
		</Box>
	)
}

export default memo(Loading)
