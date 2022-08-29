import { Avatar } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import React, { useState, useRef, useCallback, memo, useEffect } from 'react'
import ReactFlow, {
	ReactFlowProvider,
	addEdge,
	useNodesState,
	useEdgesState,
	Controls,
	ControlButton,
} from 'react-flow-renderer'
import { DefaultNode } from '../DefaultNode'

import Sidebar from '../Sidebar'

const nodeTypes = {
	defaultNode: DefaultNode,
}

const initialNodes = [
	{
		id: '1',
		type: 'defaultNode',
		data: { label: 'input node' },
		position: { x: 250, y: 5 },
	},
]

let id = 0
const getId = () => `dndnode_${id++}`

const DnDFlow = () => {
	const reactFlowWrapper = useRef(null)
	const [activeElement, setActiveElement] = useState(null)
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
	const [edges, setEdges, onEdgesChange] = useEdgesState([])
	const [reactFlowInstance, setReactFlowInstance] = useState(null)

	console.log(nodes)
	console.log(edges)

	const onConnect = useCallback(
		params => setEdges(eds => addEdge(params, eds)),
		[setEdges]
	)

	const onElementClick = (event, element) => setActiveElement(element)
	const onDragOver = useCallback(event => {
		event.preventDefault()
		event.dataTransfer.dropEffect = 'move'
	}, [])

	const deleteElementById = () => {
		if (activeElement.source) {
			setEdges(nds => nds.filter(node => node.id !== activeElement.id))
		} else {
			setNodes(nds => nds.filter(node => node.id !== activeElement.id))
		}
	}

	const onDrop = useCallback(
		event => {
			event.preventDefault()

			const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
			const type = event.dataTransfer.getData('application/reactflow')
			const model = event.dataTransfer.getData('application/reactflow/model')

			// check if the dropped element is valid
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
			if (type == 'defaultNode') {
				newNode = {
					id: getId(),
          model,
					type,
					position,
					data: { label: `${type} node`, body: <Avatar>{model}</Avatar> },
				}
			}

			setNodes(nds => nds.concat(newNode))
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
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						onConnect={onConnect}
						onInit={setReactFlowInstance}
						onDrop={onDrop}
						onDragOver={onDragOver}
						onNodeClick={onElementClick}
						onEdgeClick={onElementClick}
						fitView>
						<Controls>
							<ControlButton onClick={deleteElementById}>
								<DeleteIcon />
							</ControlButton>
						</Controls>
					</ReactFlow>
				</div>
				<Sidebar />
			</ReactFlowProvider>
		</div>
	)
}

export default memo(DnDFlow)
