/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	serverRuntimeConfig: {
		PROJECT_ROOT: __dirname
	},
	eslint: {
		ignoreDuringBuilds: true
	}
}

module.exports = nextConfig
