import { Paper, Stack, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { memo, useCallback, useEffect, useState } from 'react'
import { Handle, Position } from 'react-flow-renderer'

const operations = [
{
	operation:'add',
	symbol: '+'
},
{
	operation:'sub',
	symbol: '-'
},
{
	operation:'mul',
	symbol: '*'
},
{
	operation:'div',
	symbol: '/'
}
]
const initialInputs = {
	a: 15,
	b: 12,
	result:0,
}

function MathNode({ data }) {



	const [inputs, setInputs] = useState(initialInputs)

	useEffect(()=>{
		setInputs(inp => inp.result = inp.a + inp.b)
	},[inputs])


	return (
		<>
			<Paper
				elevation={24}
				sx={{
					width: 200,
					height: 250,
					backgroundColor: '#313131',
					padding: '18px',
				}}>
				<Handle
					type='target'
					position={Position.Left}
					key={'math-handle-first'}
					id='a'
					style={{
						width: '15px',
						height: '15px',
						backgroundColor: '#2051ab',
					}}
					isConnectable={true}
				/>
				<Handle
					type='target'
					position={Position.Left}
					key={'math-handle-second'}
					id='b'
					style={{
						top: '70%',
						width: '15px',
						height: '15px',
						backgroundColor: '#2051ab',
					}}
					isConnectable={true}
				/>
				<div>
					<Stack
						sx={{
							paddingTop: '88px',
						}}
						spacing={1.1}>
						<TextField
							value={inputs.a}
							onChange={(event)=>{
								setInputs(inp => inp.a = event.target.value)
							}}
							sx={{
								'& label': {
									color: '#2051ab',
								},
								'& .MuiInput-underline:after': {
									borderBottomColor: '#2051ab',
								},
								'& .MuiOutlinedInput-root': {
									'& fieldset': {
										borderColor: '#2051ab',
									},
									'&:hover fieldset': {
										borderColor: '#2051ab',
									},
									'&.Mui-focused fieldset': {
										borderColor: '#2051ab',
									},
								},
							}}
							size='small'
							className='nodrag'
							label='First Number'
							inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
						/>
						<TextField
							value={inputs.b}
							onChange={(event)=>{
								setInputs(inp => inp.b = event.target.value)
							}}
							sx={{
								'& label': {
									color: '#2051ab',
								},
								'& .MuiInput-underline:after': {
									borderBottomColor: '#2051ab',
								},
								'& .MuiOutlinedInput-root': {
									'& fieldset': {
										borderColor: '#2051ab',
									},
									'&:hover fieldset': {
										borderColor: '#2051ab',
									},
									'&.Mui-focused fieldset': {
										borderColor: '#2051ab',
									},
								},
							}}
							size='small'
							className='nodrag'
							label='Second Number'
							inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
						/>
						<TextField
							value={inputs.result}
							sx={{
								color: 'whitesmoke',
								'& label': {
									color: '#a85d0d',
								},
								'& .MuiInput-underline:after': {
									borderBottomColor: '#a85d0d',
								},
								'& .MuiOutlinedInput-root': {
									'& fieldset': {
										borderColor: '#a85d0d',
									},
									'&:hover fieldset': {
										borderColor: '#a85d0d',
									},
									'&.Mui-focused fieldset': {
										borderColor: '#a85d0d',
									},
								},
							}}
							color='error'
							size='small'
							className='nodrag'
							label='Result'
							disabled
							inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
						/>
					</Stack>
				</div>
				<Handle
					type='source'
					position={Position.Right}
					style={{
						top: '90%',
						width: '15px',
						height: '15px',
						backgroundColor: '#a85d0d',
					}}
					isConnectable={true}
				/>
			</Paper>
		</>
	)
}

export default memo(MathNode)
