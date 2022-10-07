/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	reactStrictMode: false,
	images: {
		domains: ['gswycufnfuvoqnrdopna.supabase.co'],
	},
	i18n: {
		locales: ['en', 'tr'],
		defaultLocale: 'en',
	},
	trailingSlash: true,
}

module.exports = nextConfig
