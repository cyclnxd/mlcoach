import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactFlow, {
	ReactFlowProvider,
	Controls,
	Background,
} from 'react-flow-renderer'
import store from 'lib/store/store.ts'
import useAuthStore from 'lib/store/AuthStore.ts'
import useDataStore from 'lib/store/DataStore.ts'
import ToolModal from 'components/Editor/ToolPanel/components/ToolModal'
import ConnectionLine from 'components/Editor/ConnectionLine'
import { Box, Stack } from '@mui/system'
import { Button, ToggleButton, ToggleButtonGroup } from '@mui/material'
import CustomDialog from 'components/Editor/Dialog'
import { v4 as uuidv4 } from 'uuid'
import ButtonMenu from 'components/Editor/ButtonMenu'
import SaveIcon from '@mui/icons-material/Save'
import FileOpenIcon from '@mui/icons-material/FileOpen'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'
import html2canvas from 'html2canvas'
import { useTranslations } from 'next-intl'
import CustomAlert from 'components/base/CustomAlert'

const Flow = ({ handleDeleteLog, handleDeleteGraph }) => {
	const t = useTranslations('editor')
	const [rfInstance, setRfInstance] = useState(null)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)
	const [openSaveMenu, setOpenSaveMenu] = useState(false)
	const [openOpenMenu, setOpenOpenMenu] = useState(false)
	const [work, setWork] = useState(null)
	const [anchorEl, setAnchorEl] = useState(null)
	const [mode, setMode] = useState('stop')

	const editorRef = useRef(null)

	const handleOpen = e => {
		setAnchorEl(e.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}
	const handleSaveMenu = () => {
		setOpenSaveMenu(!openSaveMenu)
	}
	const handleOpenMenu = () => {
		setOpenOpenMenu(!openOpenMenu)
	}

	const handleMode = (_, change) => {
		setMode(change || mode)
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
		calculate,
	} = store(state => state)

	const user = useAuthStore(state => state.user)
	const {
		updateWorkByUsername,
		getWorkByUsernameAndName,
		uploadThumbnail,
		getPublicUrl,
	} = useDataStore(state => state)

	const handleContextMenu = e => {
		e.preventDefault()
		handleModal(true)
	}

	useEffect(() => {
		if (mode === 'start') {
			calculate()
		}
	}, [calculate, mode])

	const takeScreenshot = useCallback(
		async id => {
			if (rfInstance) {
				await rfInstance.fitView()
				html2canvas(editorRef.current.firstChild, {
					allowTaint: true,
					useCORS: true,
					backgroundColor: '#403f69',
				}).then(async canvas => {
					canvas.toBlob(async blob => {
						const file = new File([blob], `${id}.jpeg`, {
							type: 'image/jpeg',
						})
						await uploadThumbnail(file, id)
					})
				})
			}
		},
		[rfInstance, uploadThumbnail]
	)

	useEffect(() => {
		setTimeout(() => {
			setError(null)
		}, 5000)
	}, [error])

	const handleSaveEditor = useCallback(
		(name, descp) => {
			async function save() {
				if (rfInstance) {
					const flow = rfInstance.toObject()
					if (!flow.nodes.length) {
						setError(t('errors.emptyFlow'))
						return
					}
					try {
						setLoading(true)
						if (work && work.name === name) {
							await takeScreenshot(work.id)
							const res = getPublicUrl(work.id, 'thumbnails')
							await updateWorkByUsername({
								...work,
								name,
								updated_at: new Date().toISOString(),
								work: JSON.stringify(flow),
								thumbnail_url: res.publicURL,
								description: descp,
							})
						} else {
							const randomId = uuidv4()
							await takeScreenshot(randomId)
							const res = getPublicUrl(randomId, 'thumbnails')
							const work = await updateWorkByUsername({
								id: randomId,
								username: user?.username,
								work: JSON.stringify(flow),
								name,
								thumbnail_url: res.publicURL,
								is_active: true,
								is_public: true,
								description: descp,
								created_at: new Date().toISOString(),
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
		[
			getPublicUrl,
			rfInstance,
			t,
			takeScreenshot,
			updateWorkByUsername,
			user?.username,
			work,
		]
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
							setError(t('errors.notFound'))
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
		[getWorkByUsernameAndName, t, user?.username]
	)

	return (
		<>
			<ReactFlowProvider
				style={{
					width: '100%',
					height: '100%',
				}}>
				<ReactFlow
					ref={editorRef}
					nodeTypes={useMemo(() => nodeTypes, [nodeTypes])}
					nodes={useMemo(() => nodes, [nodes])}
					edges={useMemo(() => edges, [edges])}
					deleteKeyCode={['Backspace', 'Delete']}
					onInit={setRfInstance}
					onNodesDelete={useMemo(() => onNodesDelete, [onNodesDelete])}
					onEdgesDelete={useMemo(() => onEdgesDelete, [onEdgesDelete])}
					onNodesChange={useMemo(() => onNodesChange, [onNodesChange])}
					onEdgesChange={useMemo(() => onEdgesChange, [onEdgesChange])}
					onConnect={useMemo(() => onConnect, [onConnect])}
					onNodeClick={useMemo(() => onNodeClick, [onNodeClick])}
					onPaneClick={useMemo(() => onPaneClick, [onPaneClick])}
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
					snapGrid={[16, 16]}
					snapToGrid={true}
					onPaneContextMenu={e => handleContextMenu(e)}>
					<Stack
						direction='row'
						spacing={2}
						sx={{
							width: '100%',
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							px: 1,
							position: 'absolute',
							top: '15px',
							zIndex: 1000,
						}}>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								gap: 2,
								alignItems: 'center',
							}}>
							<ButtonMenu
								disabled={loading || !user}
								menuDisabled={nodes.length === 0}
								anchorEl={anchorEl}
								handleClose={handleClose}
								handleOpen={handleOpen}
								title={t('buttons.editor')}
								options={[
									{
										label: t('buttonMenu.save'),
										icon: <SaveIcon />,
										onClick: () => handleSaveMenu(),
									},
									{
										label: t('buttonMenu.open'),
										icon: <FileOpenIcon />,
										onClick: () => handleOpenMenu(),
									},
								]}
							/>
							<CustomDialog
								open={openOpenMenu}
								handleClose={handleOpenMenu}
								callback={handleOpenEditor}
								title={t('editorDialog.open')}
								content={t('editorDialog.desc1')}
								label={t('editorDialog.placeholder1')}
								username={user?.username}
							/>
							<CustomDialog
								open={openSaveMenu}
								handleClose={handleSaveMenu}
								callback={handleSaveEditor}
								title={t('editorDialog.save')}
								content={t('editorDialog.desc2')}
								label={t('editorDialog.placeholder1')}
								username={user?.username}
							/>

							<Button
								variant='contained'
								sx={{
									backgroundColor: 'primary.darkLight',
									color: 'primary.contrastText',
								}}
								size='small'
								onClick={handleDeleteLog}>
								{t('buttons.output')}
							</Button>
							<Button
								variant='contained'
								sx={{
									backgroundColor: 'primary.darkLight',
									color: 'primary.contrastText',
								}}
								size='small'
								onClick={handleDeleteGraph}>
								{t('buttons.graph')}
							</Button>
							<Button
								variant='contained'
								sx={{
									backgroundColor: 'primary.darkLight',
									color: 'primary.contrastText',
								}}
								size='small'
								onClick={() => handleModal(true)}>
								{t('buttons.toolbox')}
							</Button>
						</Box>

						<ToggleButtonGroup
							size='small'
							exclusive
							aria-label='control'
							value={mode}
							onChange={handleMode}>
							<ToggleButton
								value={'start'}
								aria-label='start'
								sx={{
									color: 'primary.darkText',
									backgroundColor: 'primary.darkLight',
									'&.Mui-selected': {
										color: 'green',
										backgroundColor: 'primary.light',
									},
									'&:hover': {
										backgroundColor: 'primary.light',
										color: 'primary.darkText',
									},
									'&.Mui-selected:hover': {
										backgroundColor: 'primary.light',
										color: 'green',
									},
								}}>
								<PlayArrowIcon />
							</ToggleButton>
							<ToggleButton
								value={'stop'}
								aria-label='stop'
								sx={{
									color: 'primary.darkText',
									backgroundColor: 'primary.darkLight',
									'&.Mui-selected': {
										color: 'red',
										backgroundColor: 'primary.light',
									},
									'&:hover': {
										backgroundColor: 'primary.light',
										color: 'primary.darkText',
									},
									'&.Mui-selected:hover': {
										backgroundColor: 'primary.light',
										color: 'red',
									},
								}}>
								<StopIcon />
							</ToggleButton>
						</ToggleButtonGroup>
					</Stack>
					{error && (
						<CustomAlert
							severity='error'
							message={error}
							sx={{
								position: 'absolute',
								right: 10,
								top: 60,
								zIndex: 1000,
							}}
						/>
					)}
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
