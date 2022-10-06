import { Box, Grid, Stack, Typography } from '@mui/material'
import Loading from 'components/Loading'
import WorkCard from 'components/WorkCard'
import Head from 'next/head'
import { useEffect } from 'react'
import { useState } from 'react'
import useDataStore from 'lib/store/DataStore.ts'

export default function Workplace() {
	const [loading, setLoading] = useState(true)
	const [works, setWorks] = useState([])
	const [error, setError] = useState(null)
	const getAllWorks = useDataStore(state => state.getAllWorks)

	useEffect(() => {
		async function fetchData() {
			try {
				const works = await getAllWorks()
				setWorks(works)
				setLoading(false)
				setError(null)
			} catch (error) {
				setError(error)
			} finally {
				setLoading(false)
			}
		}
		fetchData()
	}, [getAllWorks])

	return (
		<>
			<Head>
				<title>MLCoach Workplace</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			{loading ? (
				<Loading />
			) : error?.length > 0 ? (
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						height: '100vh',
						width: '100vw',
					}}>
					<h1>Anyone has not share any work</h1>
				</Box>
			) : (
				<Stack
					component='main'
					spacing={2}
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'start',
						justifyContent: 'start',
						height: 'calc(100vh - 70px)',
						width: '100vw',
						p: 2,
						mb: 2,
						overflowY: 'scroll',
						overflowX: 'hidden',
						'&::-webkit-scrollbar': {
							width: 0,
						},
					}}>
					<Box
						sx={{
							width: '100%',
							height: '100%',
						}}>
						<Works works={works} />
					</Box>
				</Stack>
			)}
		</>
	)
}

const Works = ({ works }) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				alignItems: 'start',
				width: '100%',

				p: 2,
				gap: { xs: 2, md: 4 },
				backgroundColor: 'primary.darkLight',
				borderRadius: 2,
			}}>
			<Typography variant='h6' sx={{ color: 'primary.contrastText' }}>
				Workplace
			</Typography>
			<Grid container spacing={2}>
				{works.map(work => (
					<Grid item xs={12} sm={6} md={4} lg={3} key={work.id}>
						<WorkCard work={work} type='workplace' />
					</Grid>
				))}
			</Grid>
		</Box>
	)
}
