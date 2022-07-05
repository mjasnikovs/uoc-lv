const nextConfig = {
	reactStrictMode: false,
	serverRuntimeConfig: {
		PROJECT_ROOT: __dirname
	},
	eslint: {
		ignoreDuringBuilds: true
	},
	images: {
		domains: ['localhost', 'mx5.lv', 'cdn.mx5.lv']
	},
	productionBrowserSourceMaps: true
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true'
})

module.exports = process.env.NODE_ENV === 'production' ? nextConfig : withBundleAnalyzer(nextConfig)
