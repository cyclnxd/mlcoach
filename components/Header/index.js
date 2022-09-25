import DesignServicesIcon from '@mui/icons-material/DesignServices'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import React, { memo, useState } from 'react'
import {
	AppBar,
	Box,
	Button,
	Container,
	Icon,
	IconButton,
	Menu,
	MenuItem,
	Toolbar,
	Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Link from 'next/link'
import UserProfile from './UserProfile'

const pages = [
	{
		name: 'Editor',
		icon: <DesignServicesIcon />,
	},
	{
		name: 'Workplace',
		icon: <WorkspacesIcon />,
	},
]

const Header = () => {
	const [anchorElNav, setAnchorElNav] = useState(null)
	const handleOpenNavMenu = event => {
		setAnchorElNav(event.currentTarget)
	}
	const handleCloseNavMenu = () => {
		setAnchorElNav(null)
	}

	return (
		<AppBar
			color='primary'
			variant='contained'
			position='static'
			sx={{
				borderBottom: '1px solid #413f66',
				height: '70px',
			}}>
			<Container maxWidth='xl'>
				<Toolbar
					disableGutters
					variant='dense'
					sx={{
						height: '70px',
						display: { xs: 'flex' },
						justifyContent: { xs: 'space-between', md: 'flex-start' },
						alignItems: 'center',
					}}>
					{/*responsive layout for mobile or small devices */}
					<Link href={'/'}>
						<Typography
							variant='h6'
							noWrap
							sx={{
								mr: 2,
								display: { xs: 'none', md: 'flex' },
								fontFamily: 'monospace',
								fontWeight: 700,
								letterSpacing: '.3rem',
								color: 'inherit',
								textDecoration: 'none',
								cursor: 'pointer',
							}}>
							MLCoach
						</Typography>
					</Link>
					<Box
						sx={{ flexGrow: { md: 1 }, display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							size='large'
							aria-label='account of current user'
							aria-controls='menu-appbar'
							aria-haspopup='true'
							onClick={handleOpenNavMenu}
							color='inherit'>
							<MenuIcon />
						</IconButton>
						<Menu
							id='menu-appbar'
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: 'block', md: 'none' },
							}}>
							{pages.map((page, i) => (
								<Link key={i} href={`/${page.name.toLocaleLowerCase()}`}>
									<MenuItem onClick={handleCloseNavMenu}>
										{page.icon}

										<Typography
											textAlign='center'
											sx={{
												ml: 1,
												display: { xs: 'flex', md: 'none' },
												flexGrow: 1,
												color: 'inherit',
												textDecoration: 'none',
											}}>
											{page.name}
										</Typography>
									</MenuItem>
								</Link>
							))}
						</Menu>
					</Box>
					{/*responsive layout for desktop or nonsmall devices */}
					<Link href={'/'}>
						<Typography
							variant='h6'
							noWrap
							sx={{
								display: { xs: 'flex', md: 'none' },

								fontFamily: 'monospace',
								fontWeight: 700,
								letterSpacing: '.3rem',
								color: 'inherit',
								textDecoration: 'none',
								cursor: 'pointer',
							}}>
							MLCoach
						</Typography>
					</Link>
					<Box
						sx={{ flexGrow: { md: 1 }, display: { xs: 'none', md: 'flex' } }}>
						{pages.map((page, i) => (
							<Link href={`/${page.name.toLocaleLowerCase()}`} key={i}>
								<Button sx={{ my: 2, color: 'white', display: 'block' }}>
									{page.name}
								</Button>
							</Link>
						))}
					</Box>

					{/* navbar right side */}
					<UserProfile />
				</Toolbar>
			</Container>
		</AppBar>
	)
}
export default memo(Header)
