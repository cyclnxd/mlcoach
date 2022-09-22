import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import DesignServicesIcon from '@mui/icons-material/DesignServices'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import { memo, useState } from 'react'
import { Icon } from '@mui/material'
import Link from 'next/link'
import UserProfile from './UserProfile'

const pages = ['Editor', 'Workplace']
const icons = [
	<DesignServicesIcon key={'editor'} />,
	<WorkspacesIcon key={'workplace'} />,
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
					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
								<MenuItem key={page} onClick={handleCloseNavMenu}>
									<Icon
										aria-controls='menu-appbar'
										aria-haspopup='true'
										color='inherit'
										sx={{ display: 'flex', alignItems: 'center', my: 0.8 }}>
										{icons[i]}
									</Icon>
									<Link href={page.toLocaleLowerCase()}>
										<Typography
											textAlign='center'
											sx={{
												ml: 1,
												display: { xs: 'flex', md: 'none' },
												flexGrow: 1,
												color: 'inherit',
												textDecoration: 'none',
											}}>
											{page}
										</Typography>
									</Link>
								</MenuItem>
							))}
						</Menu>
					</Box>
					{/*responsive layout for desktop or nonsmall devices */}
					<Link href={'/'}>
						<Typography
							variant='h5'
							noWrap
							sx={{
								mr: 2,
								display: { xs: 'flex', md: 'none' },
								flexGrow: 1,
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
					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
						{pages.map(page => (
							<Link href={`/${page.toLocaleLowerCase()}`} key={page} passHref>
								<Button sx={{ my: 2, color: 'white', display: 'block' }}>
									{page}
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
