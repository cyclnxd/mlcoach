import Head from 'next/head'
import Flow from '../components/Editor'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { CircularProgress, Stack, Zoom } from '@mui/material'
import GridLayout from 'react-grid-layout'
import { useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { useRef } from 'react'
const layout = [
	{ i: 'a', x: 0, y: 0, w: 12, h: 1, static: true },
	{ i: 'b', x: 0, y: 1, w: 12, h: 12, static: true },
	{ i: 'c', x: 4, y: 7, w: 7, h: 4, minW: 5, minH: 4 },
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
		if (typeof window !== 'undefined') {
			function handleResize() {
				setWindowSize({
					width: window.innerWidth,
					height: window.innerHeight,
				})
				setTimeout(() => {
					setLoading(false)
				}, 500)
			}

			window.addEventListener('resize', handleResize)
			handleResize()

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
			{loading ? (
				<Box
					sx={{
						width: '100vw',
						height: '100vh',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}>
					<CircularProgress
						sx={{
							color: 'primary.light',
						}}
					/>
				</Box>
			) : (
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
							width: '50vw',
							height: '40vh',
							visibility: isRender ? 'visible' : 'hidden',
						}}>
						<Footer onDelete={handleDelete} isDisplay={isRender} />
					</div>
				</GridLayout>
			)}
		</>
	)
}
