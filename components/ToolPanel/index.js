import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid2 from '@mui/material/Unstable_Grid2'
import ToolItem from './ToolItem'

const nodeGroups = ['all', 'input', 'transform', 'visualization']

const nodeTypes = [
	{
		title: 'File',
		type: 'fileUpload',
		group: 'input',
		desc: 'To upload files such as csv, excel',
		input: '-',
		output: 'DataFrame',
	},
	{
		title: 'File',
		type: 'fileUpload',
		group: 'input',
		desc: 'To upload files such as csv, excel',
		input: '-',
		output: 'DataFrame',
	},
	{
		title: 'File',
		type: 'fileUpload',
		group: 'input',
		desc: 'To upload files such as csv, excel',
		input: '-',
		output: 'DataFrame',
	},
	{
		title: 'File',
		type: 'fileUpload',
		group: 'input',
		desc: 'To upload files such as csv, excel',
		input: '-',
		output: 'DataFrame',
	},
	{
		title: 'File',
		type: 'fileUpload',
		group: 'input',
		desc: 'To upload files such as csv, excel',
		input: '-',
		output: 'DataFrame',
	},
	{
		title: 'Filter',
		type: 'filterNode',
		group: 'transform',
		desc: 'Grouping and filtering data on a given column name.',
		input: 'DataFrame',
		output: 'DataFrame',
	},
]

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
	const [value, setValue] = React.useState('all')

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
					Tools
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
					<Tab label='All' {...a11yProps(nodeGroups.indexOf('all'))} />
					<Tab label='Input' {...a11yProps(nodeGroups.indexOf('input'))} />
					<Tab
						label='Transform'
						{...a11yProps(nodeGroups.indexOf('transform'))}
					/>
					<Tab
						label='Visualization'
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
						columns={{ xs: 4, sm: 8, md: 12 }}>
						{nodeTypes.map(
							(node, idx) =>
								(node.group === group || group === 'all') && (
									<ToolItem
										key={idx}
										index={idx}
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
