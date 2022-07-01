// const nextConfig = {
// 	reactStrictMode: false,
// 	serverRuntimeConfig: {
// 		PROJECT_ROOT: __dirname
// 	},
// 	eslint: {
// 		ignoreDuringBuilds: true
// 	},
// 	images: {
// 		domains: ['localhost', 'mx5.lv', 'cdn.mx5.lv']
// 	},
// 	productionBrowserSourceMaps: true
// }

// module.exports = nextConfig

const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
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
})
