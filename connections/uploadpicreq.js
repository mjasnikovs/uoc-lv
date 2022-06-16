const https = require('https')
const http = require('http')
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

		const fstream = fs.createWriteStream(tempPath)
		https.get(httpsUrl, res => res.pipe(fstream))

		fstream.on('finish', async () => {
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

			return sharp(tempPath)
				.resize(resizeOptions)
				.webp()
				.toFile(webp.webpPath)
				.then(() => {
					fs.unlink(tempPath, e => e && console.error(e))
					return resolve({url: webp.webpName})
				})
				.catch(err => reject(new Error(err)))
		})
	})

module.exports = uploadPictureHandler
