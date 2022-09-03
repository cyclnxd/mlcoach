import { Box, Grid, IconButton, TextField, Typography } from '@mui/material'
import React, { memo, useState, useEffect } from 'react'

import { Handle } from 'react-flow-renderer'

export function DefaultNode({ data }) {
	const [input, setInput] = useState('')

	useEffect(() => {
		data.states = input
	}, [data, input])

	return (
		<>
			<Grid container spacing={0.5} direction='column' alignItems='flex-start'>
				<Grid item></Grid>
				<Grid
					container
					direction='row'
					justifyContent='center'
					alignItems='center'>
					<Box
						sx={{
							height: 100,
							width: 15,
							backgroundColor: 'black',
							borderRadius: '15px 0px 0px 15px',
						}}>
						<Handle
							type='target'
							position='left'
							id='a'
							style={{
								width: '20px',
								top: '60%',
								height: '70px',
								background: 'none',
								border: 'none',
							}}
							isConnectable={true}
						/>
					</Box>
					<Box
						sx={{
							backgroundColor: '#21415E',
							border: '0.5px solid #627F9A',
							padding: 5,
							minHeight: '100px',
							color: 'white',
						}}>
						<TextField
							value={input}
							name='a'
							onChange={event => {
								setInput(event.target.value)
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
							hiddenLabel
							label='First Number'
							inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
						/>
					</Box>
					<Box
						sx={{
							height: 100,
							width: 15,
							backgroundColor: 'black',
							borderRadius: '0px 15px 15px 0px',
						}}>
						<Handle
							type='source'
							position='right'
							id='b'
							style={{
								width: '20px',
								top: '60%',
								height: '70px',
								background: 'none',
								border: 'none',
							}}
							isConnectable={true}
						/>
					</Box>
				</Grid>
			</Grid>
		</>
	)
}
