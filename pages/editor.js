import Head from 'next/head'

import DnDFlow from '../components/Editor'
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

			<Stack
				direction='column'
				alignItems='stretch'
				spacing={0}
				height='100vh'
				width='100vw'>
				<Header />
				<DnDFlow />
				<Footer />
			</Stack>
		</>
	)
}

{
	/* <Grid2
				container
				sx={{
					display: 'flex',
					flexDirection: 'column',
					flexGrow: '1',
					height: '100%',
				}}>
				<Grid2 item xs={12}>
					<DnDFlow />
				</Grid2>

				<Grid2 item xs={8}>
					<LeftFooter />
				</Grid2>
				<Grid2 item xs={4}>
					<div className='code'>SDAASDASD</div>
				</Grid2>
			</Grid2> */
}
