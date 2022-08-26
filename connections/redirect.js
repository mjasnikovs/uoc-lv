const redirect = req => {
	const ip = req.headers['x-real-ip'] || req?.connection?.remoteAddress
	if (ip !== '212.130.57.98') {
		undefined.ip
	}
}

export default redirect
