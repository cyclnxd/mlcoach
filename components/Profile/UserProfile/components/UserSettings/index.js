import {
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	MenuList,
} from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import { memo, useState } from 'react'
import { useTranslations } from 'next-intl'

const UserSettings = ({ sx }) => {
	const t = useTranslations('profile')
	const [anchorEl, setAnchorEl] = useState(null)
	const open = !!anchorEl
	const handleClick = event => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}

	return (
		<>
			<IconButton onClick={handleClick} sx={sx}>
				<SettingsIcon color='inherit' />
			</IconButton>
			<Menu
				id='basic-menu'
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}>
				<MenuList>
					<MenuItem>
						<ListItemIcon>
							<ManageAccountsIcon fontSize='small' />
						</ListItemIcon>
						<ListItemText>{t('editProfile')}</ListItemText>
					</MenuItem>
					<MenuItem>
						<ListItemIcon>
							<WorkspacesIcon fontSize='small' />
						</ListItemIcon>
						<ListItemText>{t('manageWorks')}</ListItemText>
					</MenuItem>
				</MenuList>
			</Menu>
		</>
	)
}

export default memo(UserSettings)
