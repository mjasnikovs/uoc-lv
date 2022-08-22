const https = require('https')
const path = require('path')
const fs = require('fs')

const uploadMp3Handler = url =>
	new Promise(async (resolve, reject) => {
		const type = /^(?:.*)\.mp3$/gm.exec(url)

		if (type === null) {
			return reject(new Error(`Invalid filetype for mp3 "${url}"`))
		}

		const filename = url.split('/').pop()
		const protocol = url.split(':').shift()

		const httpsUrl = (() => {
			if (protocol === 'http') {
				return url.replace(/^http:/gm, 'https:')
			}
			return url
		})()

		// console.log({url, httpsUrl, protocol, type, filename})

		console.log(httpsUrl, 'downloading...')

		https
			.get(httpsUrl, res => {
				if (res.statusCode !== 200) {
					return reject(new Error(`Status code: ${res.statusCode} for mp3 "${httpsUrl}"`))
				}

				const fstream = fs.createWriteStream(path.resolve('public/cdn/', filename))

				fstream.on('finish', async () => {
					console.log(httpsUrl, 'completed download')
					return resolve()
				})

				return res.pipe(fstream)
			})
			.on('error', err => {
				console.log(httpsUrl, 'https.get err', err)
				return reject(new Error(err))
			})
	})

module.exports = uploadMp3Handler
