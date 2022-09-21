import '../styles/globals.css'
import '../node_modules/react-grid-layout/css/styles.css'
import '../node_modules/react-resizable/css/styles.css'
import { ThemeProvider } from '@mui/material'
import create from 'zustand'
import { useEffect } from 'react'

import { darkTheme } from '../lib/themes/theme'
import store from '../lib/store/AuthStore.ts'
import Header from '../components/Header'

import { UserProvider } from '@supabase/auth-helpers-react'
import { supabaseClient } from '@supabase/auth-helpers-nextjs'

function MyApp({ Component, pageProps }) {
	const { setSession, authStateChange, setUserSession, supaClient, session } =
		create(store)()
	useEffect(() => {
		async function fetchSession() {
			await setSession()
		}

		fetchSession()
	}, [session, setSession, supaClient])

	useEffect(() => {
		let listener
		if (supaClient) {
			const { data } = authStateChange(async (event, session) => {
				if (event === 'SIGNED_OUT') {
					await setUserSession(null, null)
				} else if (event === 'USER_DELETED') {
					await setUserSession(null, null)
				}
			})
			listener = data
		}
		return () => {
			listener?.unsubscribe()
		}
	}, [authStateChange, setUserSession, supaClient])

	return (
		<UserProvider supabaseClient={supabaseClient}>
			<ThemeProvider theme={darkTheme}>
				<Header />
				<Component {...pageProps} />
			</ThemeProvider>
		</UserProvider>
	)
}

export default MyApp
