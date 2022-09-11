import Grid2 from '@mui/material/Unstable_Grid2'
import Fade from '@mui/material/Fade'
import { Card, CardActionArea, Stack, Typography } from '@mui/material'
import { useId } from 'react'
import store from '../../../store/store.ts'
import create from 'zustand'

function ToolItem({ index, title, desc, input, output, group, type }) {
	const { setNodes, handleModal } = create(store)()
	const id = useId()
	const onSelectItem = (e, nodeGroup) => {
		if (typeof type === 'undefined' || !type) {
			return
		}
		const newNode = {
			id,
			type,
			position: { x: 200, y: 100 },
			data: { label: title, group: nodeGroup },
		}
		setNodes(newNode)
		handleModal(false)
	}

	return (
		<Fade in={true} style={{ transitionDelay: `${(index + 1) * 75}ms` }}>
			<Grid2 xs={2} sm={4} md={4}>
				<CardActionArea onClick={e => onSelectItem(e, group)}>
					<Card
						sx={{
							bgcolor: 'primary.light',
							height: '100%',
							flexGrow: 1,
							padding: '10px 10px 8px 10px',
						}}>
						<Stack spacing={3} alignItems='start' justifyContent='center'>
							<Typography
								variant='body1'
								color='primary.contrastText'
								fontWeight='700'
								marginBottom='-10px'>
								{title}
							</Typography>
							<Typography
								fontSize='12px'
								color='#c5cbd2'
								sx={{
									minHeight: '57px',
									maxHeight: '57px',
									textOverflow: 'clip',
									overflow: 'clip',
								}}>
								{desc}
							</Typography>
							<Typography
								fontSize='11px'
								color='#c5cbd2'
								textOverflow='ellipsis'>
								<strong>Inputs:</strong> {input} <br />
								<strong>Output:</strong> {output}
							</Typography>
						</Stack>
					</Card>
				</CardActionArea>
			</Grid2>
		</Fade>
	)
}

export default ToolItem
