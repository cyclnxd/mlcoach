import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useRouter } from 'next/router'
import { memo } from 'react'

function IntlButton({ lang }) {
	const router = useRouter()
	const handleChange = (_, newLang) => {
		if (newLang !== null) {
			if (router.pathname === '/profile/[...username]') {
				router.push(`/profile/${router.query.username}`, router.asPath, {
					locale: newLang,
				})
			}
			router.push(router.pathname, router.asPath, { locale: newLang })
		}
	}

	return (
		<ToggleButtonGroup
			size='small'
			value={router.locale}
			exclusive
			onChange={handleChange}
			aria-label='intl'>
			<ToggleButton
				value={lang.code}
				aria-label={lang.code}
				sx={{
					ml: 0.5,
					color: 'primary.darkText',
					'&.Mui-selected': {
						color: 'primary.darkText',
						backgroundColor: 'primary.light',
					},
					'&:hover': {
						backgroundColor: 'primary.light',
						color: 'primary.darkText',
					},
					'&.Mui-selected:hover': {
						backgroundColor: 'primary.light',
						color: 'primary.darkText',
					},
				}}>
				{lang.code}
			</ToggleButton>
		</ToggleButtonGroup>
	)
}

export default memo(IntlButton)
