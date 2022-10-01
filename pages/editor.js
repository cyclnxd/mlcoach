import Head from 'next/head'
import Flow from 'components/Editor'
import Footer from 'components/Footer'
import Graph from 'components/Graph/index.js'
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

	const [isRender, setIsRender] = useState(true)

	const [dimensions, setDimensions] = useState({
		height: layout[2].h,
		width: layout[2].w,
	})

	const handleDelete = () => {
		setIsRender(!isRender)
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
						<div key='a'>
							<Flow handleDelete={handleDelete} />
						</div>

						<div
							key='b'
							style={{
								width: '50vw',
								height: '40vh',
								visibility: isRenderLog ? 'visible' : 'hidden',
							}}>
							<Footer onDelete={handleDelete} isDisplay={isRender} />
						</div>
						<div key='c'>
							<GraphPanel parentDimensions={dimensions} />
						</div>
					</GridLayout>
				</>
			)}
		</>
	)
}
