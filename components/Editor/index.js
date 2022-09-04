import React, { useState, useRef, useCallback, memo } from 'react'
import ReactFlow, {
	ReactFlowProvider,
	Controls,
	Background,
} from 'react-flow-renderer'
import store from '../../store/store.ts'
import create from 'zustand'

import Sidebar from '../Sidebar'

let id = 0
const getId = (type) => `${type}_${id++}`

const DnDFlow = () => {
	const useBoundStore = create(store)
	const {
		nodes,
		edges,
		nodeTypes,
		onNodesChange,
		onEdgesChange,
		onConnect,
		setNodes,
	} = useBoundStore()
	const reactFlowWrapper = useRef(null)
	const [reactFlowInstance, setReactFlowInstance] = useState(null)

	const onDragOver = useCallback(event => {
		event.preventDefault()
		event.dataTransfer.dropEffect = 'move'
	}, [])

	
	const onDrop = useCallback(
		event => {
			event.preventDefault()

			const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
			const type = event.dataTransfer.getData('application/reactflow')
			const model = event.dataTransfer.getData('application/reactflow/model')
			const data = event.dataTransfer.getData('application/reactflow/data')
			if (typeof type === 'undefined' || !type) {
				return
			}
			console.log(reactFlowInstance.toObject())
			const position = reactFlowInstance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			})
			const newNode = {
				id: getId(type),
				type,
				model,
				position,
				data: { label: `${type} node`,
						data : parseInt(data) },
			}

			setNodes(newNode)
		},
		[reactFlowInstance, setNodes]
	)

	return (
		<div className='dndflow'>
			<ReactFlowProvider>
				<div className='reactflow-wrapper' ref={reactFlowWrapper}>
					<ReactFlow
						nodeTypes={nodeTypes}
						nodes={nodes}
						edges={edges}
						deleteKeyCode={['Backspace', 'Delete']}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						onConnect={onConnect}
						onInit={setReactFlowInstance}
						onDrop={onDrop}
						onDragOver={onDragOver}
						fitView>
						<Controls />
						<Background style={{
							backgroundColor: '#555',
						}} />
					</ReactFlow>
				</div>
				<Sidebar />
			</ReactFlowProvider>
		</div>
	)
}

export default memo(DnDFlow)
