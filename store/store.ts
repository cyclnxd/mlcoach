import create from 'zustand/vanilla'
import { v4 as uuidv4 } from 'uuid'
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
import FileUpload from '../components/Nodes/FileUpload'
import FilterNode from '../components/Nodes/FilterNode'
import SliceNode from '../components/Nodes/SliceNode'
import DropColumn from '../components/Nodes/DropColumnNode'
const nodeTypes = {
	fileUpload: FileUpload,
	filterNode: FilterNode,
	sliceNode: SliceNode,
	dropColNode: DropColumn,
}

type RFState = {
	modalOpen: boolean
	nodes: Node[]
	edges: Edge[]
	globalNodeStates: any[]
	nodeTypes: any
	fileMap: {}
	setNodes: (node: Node) => void
	onNodesChange: OnNodesChange
	onEdgesChange: OnEdgesChange
	onEdgesDelete: any
	onConnect: OnConnect
	changeNodeState: any
	onNodesDelete: any
	onPaneClick: any
	onNodeClick: any
	storeFile: any
	clickedNode: any
	handleModal: any
}

// this is our useStore hook that we can use in our components to get parts of the store and call actions

const store = create<RFState>((set, get) => ({
	modalOpen: false,
	nodes: [],
	edges: [],
	nodeTypes: nodeTypes,
	globalNodeStates: [],
	fileMap: {},
	clickedNode: -1,
	onPaneClick: (_: any) => {
		set({
			//panele tıkladığında clicked node -1 yapıyor.
			clickedNode: -1,
		})
	},
	onNodeClick: (_: any, node: Node) => {
		set({
			clickedNode: node.id,
		})
	},
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
		let sourceNode = get().nodes.find(node => node.id === connection.source)
		let targetNode = get().nodes.find(node => node.id === connection.target)
		get().setNodes({
			...sourceNode,
			data: { ...sourceNode!.data, current: uuidv4() },
		} as Node)
		get().setNodes({
			...targetNode,
			data: { ...targetNode?.data, current: uuidv4() },
		} as Node)

		set({
			edges: addEdge(connection, get().edges),
		})
	},
	storeFile: (nodeId, file: JSON) => {
		let currentNodeEdges = get().edges.filter(edge => edge.source === nodeId)
		if (currentNodeEdges) {
			get().changeNodeState(currentNodeEdges)
		}
		set({
			fileMap: { ...get().fileMap, [nodeId]: file },
		})
	},
	onEdgesDelete: (edges: Edge[]) => {
		const [sourceNode, targetNode] = get().changeNodeState(edges)
		get().onNodesDelete([targetNode])
	},
	onNodesDelete: changes => {
		changes.forEach(change => {
			if (change.id in get().fileMap) {
				delete get().fileMap[change.id]
			}
		})
	},
	handleModal: state => {
		set({
			modalOpen: state,
		})
	},
	changeNodeState: edges => {
		var sourceNode
		var targetNode
		edges.forEach(edge => {
			let sourceNode = get().nodes.find(node => node.id === edge.source)
			let targetNode = get().nodes.find(node => node.id === edge.target)
			get().setNodes({
				...sourceNode,
				data: { ...sourceNode!.data, current: uuidv4() },
			} as Node)
			get().setNodes({
				...targetNode,
				data: { ...targetNode?.data, current: uuidv4() },
			} as Node)
		})
		return [sourceNode, targetNode]
	},
}))

export default store
