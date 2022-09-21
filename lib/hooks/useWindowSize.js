import { useState, useEffect } from 'react'

function useWindowSize() {
	const [windowSize, setWindowSize] = useState({
		width: undefined,
		height: undefined,
	})
	const [loading, setLoading] = useState(true)
	useEffect(() => {
		if (typeof window !== 'undefined') {
			function handleResize() {
				setWindowSize({
					width: window.innerWidth,
					height: window.innerHeight - 70,
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

	return [windowSize, loading]
}

export default useWindowSize
