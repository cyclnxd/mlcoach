import { FileUpload } from '@mui/icons-material'
import { Node } from 'react-flow-renderer'

const initialNodes = [
	{
		id: '1',
		type: 'fileUpload',
		data: { label: 'File' },
		position: { x: 380, y: 100 },
	},
{
	id: '2',
	type: 'fileUpload',
	data: { label: 'File' },
	position: { x: 200, y: 100 },
}

]
export default initialNodes
