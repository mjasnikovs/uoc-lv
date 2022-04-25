/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	serverRuntimeConfig: {
		PROJECT_ROOT: __dirname
	},
	env: {
		URL: process.env.URL,
	}
}

module.exports = nextConfig
