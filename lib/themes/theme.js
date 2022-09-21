import { createTheme } from '@mui/material'

export const darkTheme = createTheme({
	palette: {
		primary: {
			main: '#1a192b',
			surface: '#222138',
			contrastText: '#fff',
			light: '#403f69',
			darkLight: '#333154',
			darkText: '#c5cbd2',
		},
	},
	typography: {
		fontFamily: ['Roboto Mono', 'monospace'].join(','),
	},
	textfield: {
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
	},
})
