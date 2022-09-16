import Head from 'next/head'
import Flow from '../components/Editor'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { CircularProgress, Stack, Zoom } from '@mui/material'
import GridLayout from 'react-grid-layout'
import { useEffect, useState } from 'react'
import { Box } from '@mui/system'
const layout = [
	{ i: 'a', x: 0, y: 0, w: 12, h: 1, static: true },
	{ i: 'b', x: 0, y: 1, w: 12, h: 8, static: true },
	{ i: 'c', x: 0, y: 9, w: 12, h: 3 },
]
export default function Editor() {
	const [windowSize, setWindowSize] = useState({
		width: undefined,
		height: undefined,
	})
	const [loading, setLoading] = useState(true)
	const [isRender, setIsRender] = useState(true)

	const handleDelete = () => {
		setIsRender(!isRender)
	}

	useEffect(() => {
		// only execute all the code below in client side
		if (typeof window !== 'undefined') {
			// Handler to call on window resize
			function handleResize() {
				// Set window width/height to state
				setWindowSize({
					width: window.innerWidth,
					height: window.innerHeight,
				})
			}

			// Add event listener
			window.addEventListener('resize', handleResize)

			// Call handler right away so state gets updated with initial window size
			handleResize()

			// Remove event listener on cleanup
			return () => window.removeEventListener('resize', handleResize)
		}
	}, [])
	return (
		<>
			<Head>
				<title>MLCoach Editor</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			{/* <Stack direction='column' height='100vh' width='100vw'>
				<Header />
				<Flow />
				<Footer />
				
			</Stack> */}
			{/* {loading ? (
				<Box sx={{ display: 'flex' }}>
					<CircularProgress />
				</Box>
			) : ( )}*/}
			<GridLayout
				className='layout'
				layout={layout}
				cols={12}
				containerPadding={[0, 0]}
				allowOverlap
				maxRows={windowSize.height}
				rowHeight={windowSize.height / 12}
				width={windowSize.width}
				margin={[0, 0]}
				useCSSTransforms={true}>
				<div key='a'>
					<Header height={windowSize.height / 12} />
				</div>
				<div key='b'>
					<Flow handleDelete={handleDelete} />
				</div>

				<div
					key='c'
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<Footer onDelete={handleDelete} isDisplay={isRender} />
				</div>
			</GridLayout>
		</>
	)
}
