import '../styles/globals.css'
import '../node_modules/react-grid-layout/css/styles.css'
import '../node_modules/react-resizable/css/styles.css'
import { ThemeProvider } from '@mui/material'
import create from 'zustand'
import { useEffect } from 'react'

import { darkTheme } from '../lib/themes/theme'
import store from '../lib/store/AuthStore.ts'
import Header from '../components/Header'

function MyApp({ Component, pageProps }) {
	const { setSession, authStateChange, setUserSession } = create(store)()
	useEffect(() => {
		async function fetchSession() {
			await setSession()
		}
		fetchSession()
	}, [setSession])

	useEffect(() => {
		const { data: listener } = authStateChange(async (event, session) => {
			if (event === 'SIGNED_OUT') {
				await setUserSession(null, null)
			} else if (event === 'USER_DELETED') {
				await setUserSession(null, null)
			}
		})
		return () => {
			listener.unsubscribe()
		}
	}, [authStateChange, setUserSession])

	return (
		<ThemeProvider theme={darkTheme}>
			<Header />
			<Component {...pageProps} />
		</ThemeProvider>
	)
}

export default MyApp
