import React, { useState, useRef, useCallback, memo } from 'react'
import ReactFlow, {
	ReactFlowProvider,
	Controls,
	Background,
} from 'react-flow-renderer'
import store from '../../store/store.ts'
import create from 'zustand'
import ToolModal from '../Modal'


const DnDFlow = () => {
	const useBoundStore = create(store)
	const {
		nodes,
		edges,
		nodeTypes,
		onNodesChange,
		onEdgesChange,
		onConnect,
		onNodeClick,
		onPaneClick,
		onNodesDelete,
		handleModal,
		modalOpen
	} = useBoundStore()
	const reactFlowWrapper = useRef(null)
	const [reactFlowInstance, setReactFlowInstance] = useState(null)


	const handleContextMenu = (e) => {
		e.preventDefault()
		handleModal(true)
	}

	const onDragOver = useCallback(event => {
		event.preventDefault()
		event.dataTransfer.dropEffect = 'move'
	}, [])


	return (
		<div className='dndflow'>
			<ReactFlowProvider>
				<div className='reactflow-wrapper' ref={reactFlowWrapper}>
					<ReactFlow

						nodeTypes={nodeTypes}
						nodes={nodes}
						edges={edges}
						deleteKeyCode={['Backspace', 'Delete']}
						onNodesDelete={onNodesDelete}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						onConnect={onConnect}
						onInit={setReactFlowInstance}
						onDragOver={onDragOver}
						onNodeClick = {onNodeClick}
						onPaneClick = {onPaneClick}
						fitView
						onContextMenu={(e) => handleContextMenu(e)}
						>
						<Controls />
						<ToolModal open={modalOpen} handleModal={handleModal} />
						<Background
							style={{
								backgroundColor: '#1a192b',
							}}
						/>
					</ReactFlow>
				</div>
			</ReactFlowProvider>
		</div>
	)
}

export default memo(DnDFlow)
