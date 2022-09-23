import { memo, useCallback, useEffect, useState } from 'react'
import ReactFlow, {
	ReactFlowProvider,
	Controls,
	Background,
} from 'react-flow-renderer'
import store from 'lib/store/store.ts'
import useAuthStore from 'lib/store/AuthStore.ts'
import useDataStore from 'lib/store/DataStore.ts'
import create from 'zustand'
import ToolModal from 'components/Modal'
import ConnectionLine from 'components/ConnectionLine'
import { Box, Stack } from '@mui/system'
import { Alert, Button } from '@mui/material'
import CustomDialog from 'components/Dialog'
import { v4 as uuidv4 } from 'uuid'

const Flow = ({ handleDelete }) => {
	const [rfInstance, setRfInstance] = useState(null)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)
	const [openSaveMenu, setOpenSaveMenu] = useState(false)
	const [openOpenMenu, setOpenOpenMenu] = useState(false)
	const [work, setWork] = useState(null)

	const handleOpenSaveMenu = () => {
		setOpenSaveMenu(true)
	}
	const handleOpenOpenMenu = () => {
		setOpenOpenMenu(true)
	}

	const handleCloseSaveMenu = () => {
		setOpenSaveMenu(false)
	}
	const handleCloseOpenMenu = () => {
		setOpenOpenMenu(false)
	}

	const {
		nodes,
		edges,
		nodeTypes,
		onNodesChange,
		onEdgesChange,
		onConnect,
		onNodeClick,
		onPaneClick,
		onNodesDelete,
		onEdgesDelete,
		handleModal,
		modalOpen,
	} = create(store)()
	const { currentUserData: user } = create(useAuthStore)()
	const { updateWorkByUsername, getWorkByUsernameAndName } =
		create(useDataStore)()

	const handleContextMenu = e => {
		e.preventDefault()
		handleModal(true)
	}

	useEffect(() => {
		setTimeout(() => {
			setError(null)
		}, 4000)
	}, [error])

	const handleSaveEditor = useCallback(
		name => {
			async function save() {
				if (rfInstance) {
					const flow = rfInstance.toObject()
					try {
						setLoading(true)
						if (work && work.name === name) {
							await updateWorkByUsername({
								...work,
								name,
								updated_at: new Date().toISOString(),
								work: JSON.stringify(flow),
							})
						} else {
							const work = await updateWorkByUsername({
								id: uuidv4(),
								username: user?.username,
								work: JSON.stringify(flow),
								name,
								updated_at: new Date().toISOString(),
								is_active: true,
								is_public: true,
							})
							setWork(work)
							setError(null)
						}
					} catch (error) {
						setError(error.message)
					} finally {
						setLoading(false)
					}
				}
			}
			save()
		},
		[rfInstance, updateWorkByUsername, user?.username, work]
	)

	const handleOpenEditor = useCallback(
		name => {
			const restoreFlow = async () => {
				try {
					setLoading(true)
					const workData = await getWorkByUsernameAndName(user?.username, name)
					setWork(workData)
					let flow = JSON.parse(workData?.work)

					if (flow) {
						store.setState({
							nodes: flow.nodes,
							edges: flow.edges,
						})
					}
					setError(null)
				} catch (error) {
					switch (error.code) {
						case 'PGRST116':
							setError('Not found')
							break
						default:
							setError(error.message)
					}
				} finally {
					setLoading(false)
				}
			}

			restoreFlow()
		},
		[getWorkByUsernameAndName, user?.username]
	)

	return (
		<>
			<ReactFlowProvider
				style={{
					width: '100%',
					height: '100%',
				}}>
				<ReactFlow
					nodeTypes={nodeTypes}
					nodes={nodes}
					edges={edges}
					deleteKeyCode={['Backspace', 'Delete']}
					onInit={setRfInstance}
					onNodesDelete={onNodesDelete}
					onEdgesDelete={onEdgesDelete}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					onNodeClick={onNodeClick}
					onPaneClick={onPaneClick}
					connectionLineComponent={ConnectionLine}
					fitView
					defaultEdgeOptions={{
						animated: true,
						style: {
							strokeWidth: 2,
							strokeOpacity: 0.5,
							cursor: 'pointer',
						},
					}}
					onPaneContextMenu={e => handleContextMenu(e)}>
					<Stack
						direction='row'
						spacing={2}
						sx={{
							position: 'absolute',
							top: '10px',
							left: '10px',
							zIndex: 1000,
						}}>
						<Button
							variant='contained'
							sx={{
								backgroundColor: 'primary.darkLight',
								color: 'primary.contrastText',
							}}
							size='small'
							onClick={handleDelete}>
							Output Panel
						</Button>
						<Button
							variant='contained'
							sx={{
								backgroundColor: 'primary.darkLight',
								color: 'primary.contrastText',
							}}
							size='small'
							onClick={() => handleModal(true)}>
							ToolBox
						</Button>
						{user ? (
							<>
								<Button
									variant='contained'
									sx={{
										backgroundColor: 'primary.darkLight',
										color: 'primary.contrastText',
									}}
									disabled={loading}
									size='small'
									onClick={() => handleOpenSaveMenu()}>
									Save Editor
								</Button>
								<Button
									variant='contained'
									sx={{
										backgroundColor: 'primary.darkLight',
										color: 'primary.contrastText',
									}}
									size='small'
									disabled={loading}
									onClick={() => handleOpenOpenMenu()}>
									Open Editor
								</Button>
								<CustomDialog
									open={openOpenMenu}
									handleClose={handleCloseOpenMenu}
									callback={handleOpenEditor}
									title='Open Editor'
									content='Enter the name of the editor you saved earlier'
									label='Editor Name'
									username={user?.username}
								/>
								<CustomDialog
									open={openSaveMenu}
									handleClose={handleCloseSaveMenu}
									callback={handleSaveEditor}
									title='Save Editor'
									content='Enter the name of the editor you want to save'
									label='Editor Name'
									username={user?.username}
								/>
							</>
						) : (
							<></>
						)}
					</Stack>
					{error ? (
						<Alert
							severity='error'
							sx={{
								position: 'absolute',
								right: 10,
								top: 10,
								zIndex: 1000,
							}}>
							{error}
						</Alert>
					) : null}
					<Controls />

					<ToolModal open={modalOpen} handleModal={handleModal} />
					<Box
						sx={{
							backgroundColor: 'primary.main',
						}}>
						<Background
							style={{
								backgroundColor: 'inherit',
							}}
						/>
					</Box>
				</ReactFlow>
			</ReactFlowProvider>
		</>
	)
}

export default memo(Flow)
