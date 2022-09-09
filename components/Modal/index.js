import * as React from 'react'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Button from '@mui/material/Button'
import ToolPanel from '../ToolPanel'



const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '60%',
	height: '80%',
	minWidth: '500px',
	minHeight: '500px',
	bgcolor: '#222138',
	border: '2px solid #000',
	color: 'primary.contrastText',
	boxShadow: 24,
	p: 4,
}

export default function ToolModal({ open, handleModal }) {

	return (
		<div>
			<Button onClick={() => handleModal(true)}>Open modal</Button>
			<Modal
				aria-labelledby='transition-modal-title'
				aria-describedby='transition-modal-description'
				open={open}
				onClose={() => handleModal(false)}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}>
				<Fade in={open}>
					<Box sx={style}>
						<ToolPanel />
					</Box>
				</Fade>
			</Modal>
		</div>
	)
}
