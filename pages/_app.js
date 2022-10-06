import 'styles/globals.css'
import 'node_modules/react-grid-layout/css/styles.css'
import 'node_modules/react-resizable/css/styles.css'
import { ThemeProvider } from '@mui/material'
import { useEffect } from 'react'
import localforage from 'localforage'

import { darkTheme } from 'lib/themes/theme'
import useAuthStore from 'lib/store/AuthStore.ts'
import Header from 'components/Header'

function MyApp({ Component, pageProps }) {
	const { setSession, authStateChange, setUserSession, logout } = useAuthStore(
		state => state
	)
	useEffect(() => {
		async function fetchSession() {
			await setSession()
		}

		fetchSession()
	}, [setSession])

	useEffect(() => {
		const { data } = authStateChange(async (event, session) => {
			if (event === 'USER_DELETED') {
				logout()
			} else if (event === 'SIGNED_IN') {
				await setSession()
			} else if (event === 'TOKEN_REFRESHED') {
				await setSession()
			}
		})

		return () => {
			data?.unsubscribe()
		}
	}, [authStateChange, logout, setSession, setUserSession])

	useEffect(() => {
		localforage.config({
			name: 'mlcoach',
			driver: localforage.INDEXEDDB,
			storeName: 'fileMap',
			description: 'file map for mlcoach',
			version: 1.0,
			size: 4980736,
		})
		return () => {
			localforage.clear()
		}
	}, [])
	return (
		<ThemeProvider theme={darkTheme}>
			<Header />
			<Component {...pageProps} />
		</ThemeProvider>
	)
}

export default MyApp
