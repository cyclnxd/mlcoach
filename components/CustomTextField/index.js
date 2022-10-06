import { TextField } from '@mui/material'
import { memo } from 'react'

function CustomTextField(props) {
	return (
		<TextField
			{...props}
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
	)
}

export default memo(CustomTextField)
