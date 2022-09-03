import create from 'zustand/vanilla'
import {
	Connection,
	Edge,
	EdgeChange,
	Node,
	NodeChange,
	addEdge,
	OnNodesChange,
	OnEdgesChange,
	OnConnect,
	applyNodeChanges,
	applyEdgeChanges,
} from 'react-flow-renderer'

import initialNodes from './nodes'
import initialEdges from './edges'
import MathNode from '../components/Nodes/MathNode'
import { DefaultNode } from '../components/Nodes/DefaultNode'

const nodeTypes = {
	mathNode: MathNode,
	defaultNode: DefaultNode,
}

type RFState = {
	nodes: Node[]
	edges: Edge[]
	globalNodeStates: any[]
	setNodes: (node: Node) => void
	nodeTypes: any
	onNodesChange: OnNodesChange
	onEdgesChange: OnEdgesChange
	onConnect: OnConnect
}

const store = create<RFState>((set, get) => ({
	nodes: initialNodes,
	edges: initialEdges,
	nodeTypes: nodeTypes,
	globalNodeStates: [],
	setNodes: (node: Node) => {
		set({
			nodes: [...get().nodes, node],
		})
	},
	onNodesChange: (changes: NodeChange[]) => {
		set({
			nodes: applyNodeChanges(changes, get().nodes),
		})
	},
	onEdgesChange: (changes: EdgeChange[]) => {
		set({
			edges: applyEdgeChanges(changes, get().edges),
		})
	},
	onConnect: (connection: Connection) => {
		setDataNode(connection)
		set({
			edges: addEdge(connection, get().edges),
		})
	},
}))

const { getState, setState, subscribe, destroy } = store

function setDataNode(connection) {
	var handleData
	getState().nodes.map(node => {
		if (node.id === connection.source) {
			handleData = node.data.states
		}
		
	})
	getState().nodes.map(node => {
		if (node.id === connection.target) {
			node.data = {
				...node.data,
				states: handleData,
			}

			setState({
				nodes: [...getState().nodes, node],
			})
		}
	})

}

export default store
