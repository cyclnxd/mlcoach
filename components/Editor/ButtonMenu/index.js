import { Button, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { memo } from 'react'
import { useTranslations } from 'next-intl'

function ButtonMenu({
	anchorEl,
	handleClose,
	handleOpen,
	title,
	options,
	disabled,
	menuDisabled,
}) {
	const t = useTranslations('editor.buttonMenu')
	const open = Boolean(anchorEl)
	return (
		<>
			<Tooltip
				title={t('tooltip')}
				PopperProps={{
					disablePortal: true,
				}}
				TransitionProps={{ timeout: 700 }}>
				<span>
					<Button
						disabled={disabled}
						aria-controls={open ? 'demo-customized-menu' : undefined}
						aria-haspopup='true'
						aria-expanded={open ? 'true' : undefined}
						variant='contained'
						sx={{
							backgroundColor: 'primary.darkLight',
							color: 'primary.contrastText',
							':disabled': {
								backgroundColor: 'primary.darkLight',
								color: 'primary.contastText',
								opactiy: 1,
							},
						}}
						size='small'
						disableElevation
						onClick={handleOpen}
						endIcon={<KeyboardArrowDownIcon />}>
						{title}
					</Button>
				</span>
			</Tooltip>

			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				sx={{
					'.MuiMenu-paper': {},
				}}>
				{options.map((option, index) => (
					<MenuItem
						disabled={option.label === 'Save' && menuDisabled}
						key={index}
						onClick={() => {
							option.onClick()
							handleClose()
						}}
						disableRipple>
						{option.icon}

						<Typography
							variant='body2'
							sx={{
								marginLeft: 1,
							}}>
							{option.label}
						</Typography>
					</MenuItem>
				))}
			</Menu>
		</>
	)
}

export default memo(ButtonMenu)
