const https = require('https')
const path = require('path')
const fs = require('fs')
const sharp = require('sharp')

const uploadPictureHandler = (url, typeField) =>
	new Promise(async (resolve, reject) => {
		const type = url.split('.').pop()
		const filename = url.split('/').pop()
		const tempPath = path.resolve('temp/', `${Buffer.from(filename).toString('base64url').slice(0, 10)}.${type}`)

		const protocol = url.split(':').shift()

		const httpsUrl = (() => {
			if (protocol === 'http') {
				return url.replace(/^http:/gm, 'https:')
			}
			return url
		})()

		// console.log({url, httpsUrl, protocol, type, filename, tempPath})

		console.log(httpsUrl, 'START')
		https
			.get(httpsUrl, res => {
				if (res.statusCode !== 200) {
					return reject(new Error(`Status code: ${res.statusCode} for image "${httpsUrl}"`))
				}

				const fstream = fs.createWriteStream(tempPath)

				fstream.on('finish', async () => {
					console.log(httpsUrl, 'fstream FINISH')

					const webp = await new Promise(wepResolve => {
						const generateWebpUrl = () => {
							const webpName = `${Buffer.from(new Date().getTime() + filename)
								.toString('base64url')
								.slice(0, 25)}.webp`
							const webpPath = path.resolve('public/cdn/', webpName)

							return {webpName, webpPath}
						}

						const filePathExists = () => {
							const f = generateWebpUrl()
							fs.access(f.webpPath, fs.constants.F_OK, err => (err ? wepResolve(f) : filePathExists()))
						}
						return filePathExists()
					})

					console.log(httpsUrl, 'WEBP')

					const resizeOptions = (() => {
						if (typeField === 'thumbnail') {
							return {
								width: 864,
								height: 486,
								fit: sharp.fit.contain
							}
						}
						return {
							width: 1280,
							fit: sharp.fit.contain
						}
					})(type)

					console.log(httpsUrl, 'SHARP')

					return sharp(tempPath)
						.resize(resizeOptions)
						.webp()
						.toFile(webp.webpPath)
						.then(() => {
							fs.unlink(tempPath, e => e && console.error(e))
							console.log(httpsUrl, 'SHARP RESOLVE')
							return resolve({url: webp.webpName})
						})
						.catch(err => {
							console.log(httpsUrl, 'SHARP ERROR')
							return reject(new Error(err))
						})
				})

				return res.pipe(fstream)
			})
			.on('error', err => {
				console.log(httpsUrl, 'https.get err', err)
				return reject(new Error(err))
			})
	})

module.exports = uploadPictureHandler
