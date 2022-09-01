import { Box, Grid, IconButton, Typography } from '@mui/material'
import React, { memo } from 'react'

import { Handle } from 'react-flow-renderer'

export function DefaultNode ({ data }) {
	return (
		<>
			<Grid container spacing={0.5} direction='column' alignItems='flex-start'>
				<Grid item>
				
				</Grid>
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
						{data.body}
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
