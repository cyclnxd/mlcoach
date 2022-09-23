const ConnectionLine = ({ sourceX, sourceY, targetX, targetY }) => {
	const getBezierPath = (from, to) => {
		if (Math.abs(from.x - to.x) > Math.abs(from.y - to.y)) {
			const midX = (to.x + from.x) / 2
			return `M ${from.x},${from.y} C ${midX},${from.y} ${midX},${to.y} ${to.x},${to.y}`
		} else {
			const midY = (to.y + from.y) / 2
			return `M ${from.x},${from.y} C ${from.x},${midY} ${to.x},${midY} ${to.x},${to.y}`
		}
	}
	return (
		<>
			<path
				fill='none'
				stroke='#c5cbd2'
				strokeOpacity={0.5}
				strokeWidth={2}
				className='animated'
				d={getBezierPath(
					{ x: sourceX, y: sourceY },
					{ x: targetX, y: targetY }
				)}
			/>
		</>
	)
}

export default ConnectionLine
