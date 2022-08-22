import {getApiRouteSession} from '../../connections/ironSession'
import busboy from 'busboy'
import logger from '../../connections/logger'
import path from 'path'
import fs from 'fs'
import sharp from 'sharp'
import {getPlaiceholder} from 'plaiceholder'

export const config = {
	api: {
		bodyParser: false
	}
}

const uploadPictureHandler = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(404).send({error: 'Route accepts only post requests. The non-post request was requested.'})
	}

	if (typeof req.session.user === 'undefined') {
		return res.status(200).redirect(307, '/')
	}

	const imageHandler = new Promise((resolve, reject) => {
		const bb = busboy({headers: req.headers, limits: {files: 1, fileSize: 5 * 1048576}})
		let count = 0
		const fields = new Map()

		bb.on('field', (name, val) => fields.set(name, val))

		bb.on('file', async (name, file, {filename, mimeType}) => {
			if (['image/jpeg', 'image/jpg', 'image/png'].indexOf(mimeType) === -1) {
				file.resume()
				return reject(new Error(`Image mimeType is invalid :"${mimeType}".`))
			}

			file.on('limit', () => {
				if (count++ === 0) {
					return reject(new Error('Image filesize limit.'))
				}
			})

			const type = mimeType.split('/')
			const tempPath = path.resolve(
				'temp/',
				`${Buffer.from(filename).toString('base64url').slice(0, 10)}.${type[1]}`
			)

			const fstream = fs.createWriteStream(tempPath)
			file.pipe(fstream)

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

				const resizeOptions = (typeField => {
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
				})(fields.get('type'))

				if (fields.get('type') === 'thumbnail' && fields.get('oldThumbnailUrl') !== null) {
					const thumbnailSearch = fields
						.get('oldThumbnailUrl')
						.match(/^(?:.*?)(?:\/\/)(?:.*?)(?:\/)(.*?\.webp)$/m)

					if (thumbnailSearch !== null) {
						fs.unlink(path.resolve('public/cdn/', thumbnailSearch[1]), err => {
							if (err) {
								logger.error(err)
							}
						})
					}
				}

				try {
					const url = await sharp(tempPath)
						.resize(resizeOptions)
						.webp()
						.toFile(webp.webpPath)
						.then(() => webp.webpName)

					const {base64} = await getPlaiceholder(path.resolve('/cdn', webp.webpName))

					fs.unlink(tempPath, e => e && logger.error(e))

					if (count++ === 0) {
						return resolve({url, thumbnailBlur: base64})
					}
				} catch (err) {
					fs.unlink(tempPath, e => e && logger.error(e))
					if (count++ === 0) {
						logger.error(err)
						return reject(new Error(err))
					}
				}
			})
		})

		bb.on('error', err => {
			if (count++ === 0) {
				return reject(new Error(err))
			}
		})

		req.pipe(bb)
	})

	await imageHandler
		.then(async data => res.status(200).send(data))
		.catch(err => {
			logger.error(err)
			return res.status(500).send({message: 'Server error'})
		})
}

export default getApiRouteSession(uploadPictureHandler)
