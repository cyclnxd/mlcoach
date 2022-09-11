import Head from 'next/head'
import Flow from '../components/Editor'
import { Footer } from '../components/Footer'
import Header from '../components/Header'
import { Stack } from '@mui/material'

export default function Editor() {
	return (
		<>
			<Head>
				<title>MLCoach Editor</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<Stack direction='column' height='100vh' width='100vw'>
				<Header />
				<Flow />
				<Footer />
			</Stack>
		</>
	)
}
