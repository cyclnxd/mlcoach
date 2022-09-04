import '../styles/globals.css'
import '../components/Nodes/fileUp/fileUpload.css'
import { createTheme, ThemeProvider } from '@mui/material'

const darkTheme = createTheme({
	palette: {
		primary: {
			main: '#1a192b',
			contrastText: '#fff',
			light: '#413f66',
		},
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
