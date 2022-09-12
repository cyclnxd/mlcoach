import React, { useState, useRef, useCallback, memo } from 'react'
import ReactFlow, {
	ReactFlowProvider,
	Controls,
	Background,
} from 'react-flow-renderer'
import store from '../../store/store.ts'
import create from 'zustand'
import ToolModal from '../Modal'
import ConnectionLine from '../ConnectionLine'
import { Box } from '@mui/system'

const Flow = () => {
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
		modalOpen,
	} = useBoundStore()
	const reactFlowWrapper = useRef(null)
	const [reactFlowInstance, setReactFlowInstance] = useState(null)

	const handleContextMenu = e => {
		e.preventDefault()
		handleModal(true)
	}

	const onDragOver = useCallback(event => {
		event.preventDefault()
		event.dataTransfer.dropEffect = 'move'
	}, [])

	return (
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
					onNodeClick={onNodeClick}
					onPaneClick={onPaneClick}
					connectionLineComponent={ConnectionLine}
					fitView
					defaultEdgeOptions={{
						animated: true,

						style: {
							strokeWidth: 2,
							strokeOpacity: 0.5,
							cursor: 'pointer',
						},
					}}
					onPaneContextMenu={e => handleContextMenu(e)}>
					<Controls />
					<ToolModal open={modalOpen} handleModal={handleModal} />
					<Box
						sx={{
							backgroundColor: 'primary.main',
						}}>
						<Background
							style={{
								backgroundColor: 'inherit',
							}}
						/>
					</Box>
					<Box
						sx={{
							position: 'absolute',
							bottom: 0,
							right: 0,
							width: '52px',
							height: '15px',
							backgroundColor: 'primary.main',
							zIndex: 9999,
						}}
					/>
				</ReactFlow>
			</div>
		</ReactFlowProvider>
	)
}

export default memo(Flow)
