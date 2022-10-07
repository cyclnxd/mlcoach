import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import WorkCard from 'components/base/WorkCard'
import { useTranslations } from 'next-intl'
import { memo } from 'react'

const UserWorks = ({ works, avatar_url, isOwner }) => {
	const t = useTranslations('profile')
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				alignItems: 'start',
				width: '100%',

				p: 3,
				gap: { xs: 2, md: 4 },
				backgroundColor: 'primary.darkLight',
				borderRadius: 2,
			}}>
			<Typography variant='h6' sx={{ color: 'primary.contrastText' }}>
				{t('works')}
			</Typography>
			<Grid container spacing={2}>
				{works.map(work => (
					<Grid item xs={12} sm={6} md={4} lg={3} key={work.id}>
						<WorkCard work={work} avatar_url={avatar_url} isOwner={isOwner} />
					</Grid>
				))}
			</Grid>
		</Box>
	)
}

export default memo(UserWorks)
