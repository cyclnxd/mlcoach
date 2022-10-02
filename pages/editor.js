import Head from 'next/head'
import Flow from 'components/Editor'
import Footer from 'components/Footer'
import GridLayout from 'react-grid-layout'
import { useState } from 'react'
import useWindowSize from 'lib/hooks/useWindowSize'
import Loading from 'components/Loading'
import GraphPanel from 'components/GraphPanel'
const layout = [
	{ i: 'b', x: 0, y: 0, w: 12, h: 12, static: true },
	{ i: 'c', x: 1, y: 8, w: 7, h: 4, minW: 5, minH: 4 },
	{ i: 'd', x: 8, y: 8, w: 4, h: 4, minW: 2, minH: 4 },
]
export default function Editor() {
	const [windowSize, loading] = useWindowSize()

	const [isRenderLog, setIsRenderLog] = useState(false)
	const [isRenderGraph, setIsRenderGraph] = useState(false)

	const [dimensions, setDimensions] = useState({
		height: layout[2].h,
		width: layout[2].w,
	})

	const handleDeleteLog = () => {
		setIsRenderLog(!isRenderLog)
	}

	const handleDeleteGraph = () => {
		setIsRenderGraph(!isRenderGraph)
	}

	return (
		<>
			<Head>
				<title>MLCoach Editor</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			{loading ? (
				<Loading />
			) : (
				<>
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
						useCSSTransforms={true}
						onLayoutChange={layout => {
							setDimensions({
								height: layout[2].h,
								width: layout[2].w,
							})
						}}>
						<div key='b'>
							<Flow
								handleDeleteLog={handleDeleteLog}
								handleDeleteGraph={handleDeleteGraph}
							/>
						</div>

						<div
							key='c'
							style={{
								width: '50vw',
								height: '40vh',
								visibility: isRenderLog ? 'visible' : 'hidden',
							}}>
							<Footer onDelete={handleDeleteLog} isDisplay={isRenderLog} />
						</div>
						<div
							key='d'
							style={{
								width: '50vw',
								height: '40vh',
								visibility: isRenderGraph ? 'visible' : 'hidden',
							}}>
							<GraphPanel
								parentDimensions={dimensions}
								onDelete={handleDeleteGraph}
								isDisplay={isRenderGraph}
							/>
						</div>
					</GridLayout>
				</>
			)}
		</>
	)
}
