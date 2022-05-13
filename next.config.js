/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	serverRuntimeConfig: {
		PROJECT_ROOT: __dirname
	},
	env: {
		NEXT_PUBLIC_HOSTNAME: process.env.HOSTNAME
	}
}

module.exports = nextConfig
