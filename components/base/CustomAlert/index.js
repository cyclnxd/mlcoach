import { Alert } from '@mui/material'
import { memo } from 'react'

function CustomAlert({ message, severity, props, sx }) {
	return (
		<Alert
			{...props}
			severity={severity}
			sx={{
				backgroundColor: 'primary.light',
				color: 'primary.darkText',
				'& .MuiAlert-icon': {
					color: 'primary.darkText',
				},
				...sx,
			}}>
			{message}
		</Alert>
	)
}

export default memo(CustomAlert)
