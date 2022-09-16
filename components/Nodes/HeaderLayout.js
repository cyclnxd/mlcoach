import React from 'react'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import StormIcon from '@mui/icons-material/Storm'
import { Box, Typography } from '@mui/material'
import store from '../../store/store.ts'
function HeaderLayout({ title, id }) {
	const handleDelete = () => {
		store.getState().onNodesChange([{ id, type: 'remove' }])
		store.getState().onNodesDelete([{ id, type: 'remove' }])
	}
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'space-between',
				width: '100%',
				height: '30px',
				borderBottom: '1px solid',
				borderColor: 'primary.light',
				padding: '0 3px 0 2px',
				fontSize: '10px',
				color: 'primary.darkText',
			}}>
			<DragIndicatorIcon fontSize='inherit' />
			<Typography
				fontSize={14}
				component='div'
				sx={{ flexGrow: 1, color: 'primary.contrastText' }}>
				{title}
			</Typography>
			<StormIcon
				onClick={handleDelete}
				className='nodrag'
				fontSize='inherit'
				color='inherit'
				sx={{
					cursor: 'pointer',
					opacity: 0.5,
					'&:hover': {
						color: 'primary.darkText',
						opacity: 1,
					},
				}}
			/>
		</Box>
	)
}

export default HeaderLayout
