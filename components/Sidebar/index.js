import React, { memo } from 'react'

const Sidebar = () => {
	const onDragStart = (event, nodeType, model, data) => {
		event.dataTransfer.setData('application/reactflow', nodeType)
		event.dataTransfer.setData('application/reactflow/model', model)
		event.dataTransfer.setData('application/reactflow/data', data)
		event.dataTransfer.effectAllowed = 'move'
	}

	return (
		<aside>
			<div className='description'>
				You can drag these nodes to the pane on the right.
			</div>
			<div
				className='dndnode input'
				onDragStart={event => onDragStart(event, 'input')}
				draggable>
				Input Node
			</div>
			<div
				className='dndnode'
				onDragStart={event => onDragStart(event, 'default')}
				draggable>
				Default Node
			</div>
			<div
				className='dndnode'
				onDragStart={event => onDragStart(event, 'mathNode', 'Conv2d')}
				draggable>
				Math Operation
			</div>
			<div
				className='dndnode'
				onDragStart={event => onDragStart(event, 'variableInput', 'Input', 0)}
				draggable>
				Variable Input
			</div>
			<div
				className='dndnode output'
				onDragStart={event => onDragStart(event, 'output')}
				draggable>
				Output Node
			</div>
		</aside>
	)
}

export default memo(Sidebar)
