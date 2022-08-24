const nextConfig = {
	reactStrictMode: false,
	serverRuntimeConfig: {
		PROJECT_ROOT: __dirname
	},
	eslint: {
		ignoreDuringBuilds: true
	},
	images: {
		domains: ['localhost', 'uoc.lv', 'cdn.uoc.lv']
	},
	productionBrowserSourceMaps: true
}

const expo = (() => {
	if (process.env.NODE_ENV === 'devlopment') {
		const withBundleAnalyzer = require('@next/bundle-analyzer')({
			enabled: process.env.ANALYZE === 'true'
		})
		return withBundleAnalyzer(nextConfig)
	}

	return nextConfig
})()

module.exports = expo
