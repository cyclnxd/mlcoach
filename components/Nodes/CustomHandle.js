import { Box } from '@mui/material'
import { memo } from 'react'
import { Handle } from 'react-flow-renderer'

function CustomHandle({ type, position, id, isConnectable = true, onConnect }) {
	return (
		<Box
			sx={{
				height: type === 'target' ? '15px' : '100px',
				left: type === 'target' ? '0%' : null,
				right: type === 'target' ? '0px' : null,
				width: 15,
				backgroundColor: 'primary.light',
				borderRadius:
					type === 'target' ? '15px 0px 0px 15px' : '0px 15px 15px 0px',
			}}>
			<Handle
				type={type}
				position={position}
				id={id}
				style={{
					left: 'inherit',
					width: 'inherit',
					top: '50%',
					right: 'inherit',
					height: 'inherit',
					background: 'none',
					border: 'none',
					borderRadius: 'inherit',
				}}
				isConnectable={isConnectable}
				onConnect={onConnect}
			/>
		</Box>
	)
}

export default memo(CustomHandle)
