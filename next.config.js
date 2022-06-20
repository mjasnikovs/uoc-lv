/** @type {import('next').NextConfig} */
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
	}
}

module.exports = nextConfig
