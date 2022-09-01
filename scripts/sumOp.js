import store from '../store/store.ts'


const { getState, setState, subscribe, destroy } = store


export default function printNodes(){
  var nodes = getState().nodes
  console.log (nodes);
}
