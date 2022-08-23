const redirect = req => {
	const ip = req.headers['x-real-ip'] || req?.connection?.remoteAddress
	// if (ip !== '80.89.79.68') {
	// 	undefined.ip
	// }
}

export default redirect
