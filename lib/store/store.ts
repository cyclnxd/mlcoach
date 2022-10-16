import create from 'zustand'
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
import FileUpload from 'components/Nodes/FileUpload'
import FilterNode from 'components/Nodes/FilterNode'
import SliceNode from 'components/Nodes/SliceNode'
import DropColumn from 'components/Nodes/DropColumnNode'
import fillWithConstantNode from 'components/Nodes/MissingValueNodes/fillWithConstantNode'
import FillWithStatsNode from 'components/Nodes/MissingValueNodes/fillWithStatsNode'
import localforage from 'localforage'

const nodeTypes = {
	fileUpload: FileUpload,
	filterNode: FilterNode,
	sliceNode: SliceNode,
	dropColNode: DropColumn,
	fillWithConstantNode: fillWithConstantNode,
	fillWithStatisticsNode: FillWithStatsNode,
}

type RFState = {
	modalOpen: boolean
	nodes: Node[]
	edges: Edge[]
	nodeTypes: any
	fileMap: {}
	setNodes: (node: Node) => void
	onNodesChange: OnNodesChange
	onEdgesChange: OnEdgesChange
	onEdgesDelete: (edges: Edge[]) => void
	onConnect: OnConnect
	changeNodeState: (edges: Edge[]) => [Node<any>, Node<any>]
	onNodesDelete: any
	onPaneClick: any
	onNodeClick: any
	storeFile: (ref: string) => void
	clickedNode: number | string
	handleModal: any
}

const store = create<RFState>((set, get) => ({
	modalOpen: false,
	nodes: [],
	edges: [],
	nodeTypes: nodeTypes,
	fileMap: {},
	clickedNode: -1,
	onPaneClick: (_: any) => {
		set({
			//panele tıkladığında clicked node -1 yapıyor.
			clickedNode: -1,
		})
	},
	onNodeClick: (e: any, node: Node) => {
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
			data: { ...sourceNode?.data, current: uuidv4() },
		} as Node)
		get().setNodes({
			...targetNode,
			data: { ...targetNode?.data, current: uuidv4() },
		} as Node)

		set({
			edges: addEdge(connection, get().edges),
		})
	},
	storeFile: (ref: string) => {
		let currentNodeEdges = get().edges.filter(edge => edge.source === ref)
		if (currentNodeEdges) {
			get().changeNodeState(currentNodeEdges)
		}
		set({
			fileMap: { ...get().fileMap, [ref]: uuidv4() },
		})
	},
	calculate: () => {
		get().edges.forEach(edge => {
			console.log(edge)
		})
	},
	onEdgesDelete: (edges: Edge[]) => {
		const [sourceNode, targetNode] = get().changeNodeState(edges)
		get().onNodesDelete([sourceNode, targetNode])
	},
	onNodesDelete: (changes: any[]) => {
		if (changes.length > 0) {
			changes.forEach((change: { id: string }) => {
				if (localforage.getItem(change?.id)) {
					set({ fileMap: { ...get().fileMap, [change?.id]: null } })
					localforage.removeItem(change?.id)
				}
			})
		}
	},
	handleModal: (state: any) => {
		set({
			modalOpen: state,
		})
	},
	changeNodeState: (edges: any[]) => {
		var sourceNode: Node | null
		var targetNode: Node | null
		edges.forEach((edge: { source: string; target: string }) => {
			sourceNode = get().nodes.find(node => node.id === edge.source)
			targetNode = get().nodes.find(node => node.id === edge.target)
			if (sourceNode !== undefined && targetNode !== undefined) {
				get().setNodes({
					...sourceNode,
					data: { ...sourceNode?.data, current: uuidv4() },
				} as Node)

				get().setNodes({
					...targetNode,
					data: { ...targetNode?.data, current: uuidv4() },
				} as Node)
			}
		})
		return [sourceNode, targetNode]
	},
}))

export default store
