import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid2 from '@mui/material/Unstable_Grid2'
import ToolItem from './components/ToolItem'
import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const nodeGroups = ['all', 'input', 'transform', 'visualization']

function TabPanel(props) {
	const { children, value, index, ...other } = props

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			{...other}>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography component={'div'} sx={{ flexGrow: 1 }}>
						{children}
					</Typography>
				</Box>
			)}
		</div>
	)
}
function a11yProps(index) {
	return {
		id: `vertical-tab-${index}`,
		'aria-controls': `vertical-tabpanel-${index}`,
	}
}

export default function ToolPanel() {
	const t = useTranslations('editor.nodes')
	const tb = useTranslations('editor.toolbox')
	const [value, setValue] = useState('all')

	const nodeTypes = useMemo(() => {
		return [
			{
				title: t('file.name'),
				type: 'fileUpload',
				group: t('file.group'),
				desc: t('file.desc'),
				input: '-',
				output: 'DataFrame',
			},
			{
				title: t('dropColumn.name'),
				type: 'dropColNode',
				group: t('dropColumn.group'),
				desc: t('dropColumn.desc'),
				input: 'DataFrame',
				output: 'DataFrame',
			},
			{
				title: t('slice.name'),
				type: 'sliceNode',
				group: t('slice.group'),
				desc: t('slice.desc'),
				input: 'DataFrame',
				output: 'DataFrame',
			},
			{
				title: t('fillWithConstant.name'),
				type: 'fillWithConstantNode',
				group: t('fillWithConstant.group'),
				desc: t('fillWithConstant.desc'),
				input: 'DataFrame',
				output: 'DataFrame',
			},
			{
				title: t('fillWithStatistics.name'),
				type: 'fillWithStatisticsNode',
				group: t('fillWithStatistics.group'),
				desc: t('fillWithStatistics.desc'),
				input: 'DataFrame',
				output: 'DataFrame',
			},
			{
				title: t('filter.name'),
				type: 'filterNode',
				group: t('filter.group'),
				desc: t('filter.desc'),
				input: 'DataFrame',
				output: 'DataFrame',
			},
		]
	}, [t])
	const handleChange = (_, newValue) => {
		setValue(newValue)
	}

	return (
		<Box
			sx={{
				flexGrow: 1,
				display: 'flex',
				height: '100%',
			}}>
			<div>
				<Typography
					variant='h5'
					component='div'
					sx={{ flexGrow: 1, marginBottom: '10px', textAlign: 'center' }}>
					{tb('name')}
				</Typography>
				<Tabs
					orientation='vertical'
					variant='scrollable'
					textColor='inherit'
					indicatorColor='secondary'
					value={nodeGroups.indexOf(value)}
					onChange={(_, newValue) => handleChange(_, nodeGroups[newValue])}
					aria-label='Vertical tabs example'
					sx={{ borderRight: 1, borderColor: 'divider' }}>
					<Tab label={tb('all')} {...a11yProps(nodeGroups.indexOf('all'))} />
					<Tab
						label={tb('input')}
						{...a11yProps(nodeGroups.indexOf('input'))}
					/>
					<Tab
						label={tb('transform')}
						{...a11yProps(nodeGroups.indexOf('transform'))}
					/>
					<Tab
						label={tb('visualization')}
						{...a11yProps(nodeGroups.indexOf('visualization'))}
					/>
				</Tabs>
			</div>
			{nodeGroups.map((group, index) => (
				<TabPanel
					key={index}
					value={nodeGroups.indexOf(value)}
					index={nodeGroups.indexOf(group)}
					style={{
						flexGrow: 1,
						overflow: 'auto',
					}}>
					<Grid2
						container
						spacing={{ xs: 2, md: 3 }}
						columns={{ xs: 2, sm: 2, md: 8 }}>
						{nodeTypes.map(
							(node, idx) =>
								(node.group === group || group === 'all') && (
									<ToolItem
										key={idx}
										group={node.group}
										title={node.title}
										type={node.type}
										desc={node.desc}
										input={node.input}
										output={node.output}
									/>
								)
						)}
					</Grid2>
				</TabPanel>
			))}
		</Box>
	)
}
