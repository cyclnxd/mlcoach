import 'styles/globals.css'
import 'node_modules/react-grid-layout/css/styles.css'
import 'node_modules/react-resizable/css/styles.css'
import { createTheme, ThemeProvider } from '@mui/material'
import { trTR, enUS } from '@mui/material/locale'
import { useEffect, useMemo } from 'react'
import localforage from 'localforage'

import { theme } from 'lib/themes/theme'
import useAuthStore from 'lib/store/AuthStore.ts'
import Header from 'components/base/Header'
import { NextIntlProvider } from 'next-intl'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {
	const { setSession, authStateChange, setUserSession, logout } = useAuthStore(
		state => state
	)
	const { locale } = useRouter()
	const darkTheme = useMemo(
		() => createTheme(theme, locale === 'en' ? enUS : trTR),
		[locale]
	)
	const messages = useMemo(() => {
		return locale
			? require(`/content/locales/${locale}.json`)
			: require('/content/locales/en.json')
	}, [locale])

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
		<NextIntlProvider messages={messages}>
			<ThemeProvider theme={darkTheme}>
				<Header />
				<Component {...pageProps} />
			</ThemeProvider>
		</NextIntlProvider>
	)
}

export default MyApp
