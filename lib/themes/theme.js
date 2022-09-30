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
		color: 'primary.contrastText',
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					color: 'primary.contrastText',
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					color: 'primary.contrastText',
					fontSize: '12px',
					label: {
						color: 'primary.contrastText',
						fontSize: '12px',
					},
					'& fieldset': {
						borderColor: 'primary.darkLight',
					},
					'&:hover fieldset': {
						borderColor: 'primary.light',
					},
					'&.Mui-focused fieldset': {
						borderColor: 'primary.light',
					},
					'&$focused': {
						color: 'primary.contrastText',
						'&.Mui-focused': {
							borderWidth: 1,
						},
					},
				},
			},
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {
					color: 'primary.contrastText',
				},
			},
		},
		MuiAutocomplete: {
			styleOverrides: {
				root: {
					color: 'primary.contrastText',
				},
				clearIndicator: {
					color: 'primary.contrastText',
				},
				inputRoot: {
					color: 'primary.contrastText',
				},
				paper: {
					backgroundColor: 'primary.surface',
				},
				tag: {
					color: 'primary.contrastText',
				},
			},
		},

		MuiTypography: {
			styleOverrides: {
				root: {
					color: 'primary.contrastText',
				},
			},
		},
	},
})
