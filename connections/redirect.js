const redirect = req => {
	const ip = req.headers['x-real-ip'] || req?.connection?.remoteAddress
	if (ip === '80.89.79.68') {
		return {
			redirect: {
				permanent: false,
				destination: 'https://www.youtube.com/channel/UCNmY1L1C4l_rYtZx9rNDO2w'
			},
			props: {}
		}
	}
}

export default redirect
