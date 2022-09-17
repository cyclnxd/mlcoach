import React, { useState, useRef, useCallback, memo, useMemo } from 'react'
import ReactFlow, { Controls, Background } from 'react-flow-renderer'
import store from '../../store/store.ts'
import create from 'zustand'
import ToolModal from '../Modal'
import ConnectionLine from '../ConnectionLine'
import { Box, Stack } from '@mui/system'
import { Button } from '@mui/material'

const Flow = ({ handleDelete }) => {
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
		onEdgesDelete,
		handleModal,
		modalOpen,
	} = useBoundStore()

	const handleContextMenu = e => {
		e.preventDefault()
		handleModal(true)
	}

	return (
		<ReactFlow
			nodeTypes={useMemo(() => nodeTypes, [nodeTypes])}
			nodes={useMemo(() => nodes, [nodes])}
			edges={useMemo(() => edges, [edges])}
			deleteKeyCode={['Backspace', 'Delete']}
			onNodesDelete={onNodesDelete}
			onEdgesDelete={onEdgesDelete}
			onNodesChange={useMemo(() => onNodesChange, [onNodesChange])}
			onEdgesChange={useMemo(() => onEdgesChange, [onEdgesChange])}
			onConnect={onConnect}
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
			<Stack
				direction='row'
				spacing={2}
				sx={{
					position: 'absolute',
					top: '10px',
					left: '10px',
					zIndex: 1000,
					fontSize: '0.8rem',
				}}>
				<Button
					variant='contained'
					sx={{
						backgroundColor: 'primary.darkLight',
						color: 'primary.contrastText',
					}}
					size='small'
					onClick={handleDelete}>
					Output Panel
				</Button>
				<Button
					variant='contained'
					sx={{
						backgroundColor: 'primary.darkLight',
						color: 'primary.contrastText',
					}}
					size='small'
					onClick={() => handleModal(true)}>
					ToolBox
				</Button>
			</Stack>
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
		</ReactFlow>
	)
}

export default memo(Flow)
