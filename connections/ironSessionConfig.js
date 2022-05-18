const ironSessionSettings = {
	cookieName: 'uoclv',
	password: process.env.COOKIESALT,
	cookieOptions: {
		secure: process.env.NODE_ENV === 'production'
	}
}

export default ironSessionSettings
