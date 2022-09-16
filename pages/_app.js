import '../styles/globals.css'
import '/node_modules/react-grid-layout/css/styles.css'
import '/node_modules/react-resizable/css/styles.css'
import { createTheme, ThemeProvider } from '@mui/material'

const darkTheme = createTheme({
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
})

function MyApp({ Component, pageProps }) {
	return (
		<ThemeProvider theme={darkTheme}>
			<Component {...pageProps} />
		</ThemeProvider>
	)
}

export default MyApp
