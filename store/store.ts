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
} from 'react-flow-renderer';

import initialNodes from './nodes';
import initialEdges from './edges';

type RFState = {
  nodes: Node[];
  edges: Edge[];
  setNodes: any;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const store = create<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  setNodes: (node: Node) =>{
    set({
      nodes: [...get().nodes, node],
    });
  },
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
}));

export default store;
