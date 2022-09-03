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
<<<<<<< HEAD
import variableInput from '../components/Nodes/MathNode/variableInput'
import { DashboardCustomizeSharp } from '@mui/icons-material'
const nodeTypes = {
	mathNode: MathNode,
	variableInput: variableInput,
=======
import { DefaultNode } from '../components/Nodes/DefaultNode'

const nodeTypes = {
	mathNode: MathNode,
	defaultNode: DefaultNode,
>>>>>>> 69ac93388c28aca007eafe4138884e784e41a896
}

type RFState = {
	nodes: Node[]
	edges: Edge[]
	globalNodeStates: any[]
	setNodes: (node: Node) => void
	nodeTypes: any
	dummyVar: number
	realVar: number
	onNodesChange: OnNodesChange
	onEdgesChange: OnEdgesChange
	onConnect: OnConnect
	onStore: any
}
<<<<<<< HEAD
 
// this is our useStore hook that we can use in our components to get parts of the store and call actions
=======

>>>>>>> 69ac93388c28aca007eafe4138884e784e41a896
const store = create<RFState>((set, get) => ({
	nodes: initialNodes,
	edges: initialEdges,
	nodeTypes: nodeTypes,
<<<<<<< HEAD
	result: 0,
	dummyVar: 0,
	realVar: 0,
=======
	globalNodeStates: [],
>>>>>>> 69ac93388c28aca007eafe4138884e784e41a896
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
		 UpdateVar(connection,get().dummyVar)
	},
<<<<<<< HEAD
	onStore : (data: number) =>{
		set({
			dummyVar : data
		})

	}
}))

function UpdateVar(connection, data){
	if(connection.source !== "") store.getState().realVar = data
	else store.getState().realVar = 0
=======
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

>>>>>>> 69ac93388c28aca007eafe4138884e784e41a896
}

export default store
 
