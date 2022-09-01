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
const getId = () => `dndnode_${id++}`

const DnDFlow = () => {
	const useBoundStore = create(store)
	const { nodes, edges, onNodesChange, onEdgesChange, onConnect, setNodes } = useBoundStore()
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

			if (typeof type === 'undefined' || !type) {
				return
			}

			const position = reactFlowInstance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			})
			const newNode = {
				id: getId(),
				type,
				model,
				position,
				data: { label: `${type} node` },
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
						<Background />
					</ReactFlow>
				</div>
				<Sidebar />
			</ReactFlowProvider>
		</div>
	)
}

export default memo(DnDFlow)
