import Head from 'next/head'
import Flow from 'components/Editor'
import Footer from 'components/Footer'
import GridLayout from 'react-grid-layout'
import { useState } from 'react'
import useWindowSize from 'lib/hooks/useWindowSize'
import Loading from 'components/Loading'
const layout = [
	{ i: 'b', x: 0, y: 0, w: 12, h: 12, static: true },
	{ i: 'c', x: 4, y: 7, w: 7, h: 4, minW: 5, minH: 4 },
]
export default function Editor() {
	const [windowSize, loading] = useWindowSize()

	const [isRender, setIsRender] = useState(true)

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
						useCSSTransforms={true}>
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
				</>
			)}
		</>
	)
}
