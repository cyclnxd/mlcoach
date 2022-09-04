import { Box } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'

function Footer() {
	return (
		<Grid2 container>
			<Grid2 item xs={8}>
				<Box
					sx={{
						backgroundColor: 'primary.main',
						color: 'primary.contrastText',
						height: '100%',
						width: '100%',
						border: '1px solid #413f66',
					}}
				/>
			</Grid2>
			<Grid2 item xs={4}>
				<div className='code'>SDAASDASD</div>
			</Grid2>
		</Grid2>
	)
}

export { Footer }
