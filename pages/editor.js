import Head from 'next/head'
import Flow from 'components/Editor'
import OutputPanel from 'components/OutputPanel'
import GridLayout from 'react-grid-layout'
import { useState } from 'react'
import useWindowSize from 'lib/hooks/useWindowSize'
import Loading from 'components/Loading'
import GraphPanel from 'components/GraphPanel'
const layout = [
	{ i: 'a', x: 0, y: 0, w: 12, h: 12, static: true },
	{ i: 'b', x: 4, y: 7, w: 7, h: 4, minW: 5, minH: 4 },
	{ i: 'c', x: 6, y: 5, w: 5, h: 6, minW: 5, minH: 6 },
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
						draggableCancel='.nodrag'
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
						<div key='a'>
							<Flow
								handleDeleteLog={handleDeleteLog}
								handleDeleteGraph={handleDeleteGraph}
							/>
						</div>

						<div
							key='b'
							style={{
								visibility: isRenderLog ? 'visible' : 'hidden',
							}}>
							{isRenderLog && (
								<OutputPanel
									onDelete={handleDeleteLog}
									isDisplay={isRenderLog}
								/>
							)}
						</div>
						<div
							key='c'
							style={{
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
