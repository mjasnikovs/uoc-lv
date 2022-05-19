import {withIronSessionApiRoute} from 'iron-session/next'
import ironSessionConfig from '../../../connections/ironSessionConfig'
import fs from 'fs'
import path from 'path'
import busboy from 'busboy'
import logger from '../../../connections/logger'
import pg from '../../../connections/pg'
import sharp from 'sharp'

export const config = {
	api: {
		bodyParser: false
	}
}

const handler = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(404).send({error: 'Route accepts only post requests. The non-post request was requested.'})
	}

	if (typeof req.session.user === 'undefined') {
		return res.status(200).redirect(307, '/')
	}

	const avatarName = `${req.session.user.name}${new Date().getTime()}.webp`
	const imagePath = path.resolve('public/avatars/', avatarName)

	const imageHandler = new Promise((resolve, reject) => {
		const bb = busboy({headers: req.headers, limits: {files: 1, fileSize: 5 * 1048576}})
		let count = 0

		bb.on('file', async (name, file, {filename, mimeType}) => {
			if (['image/jpeg', 'image/jpg', 'image/png'].indexOf(mimeType) === -1) {
				file.resume()
				return reject(new Error(`Image mimeType is invalid :"${mimeType}".`))
			}

			const type = mimeType.split('/')
			const tempPath = path.resolve(
				'temp/',
				`${Buffer.from(filename).toString('base64url').slice(0, 10)}.${type[1]}`
			)

			const fstream = fs.createWriteStream(tempPath)
			file.pipe(fstream)

			file.on('limit', () => {
				if (count++ === 0) {
					return reject(new Error('Image filesize limit.'))
				}
			})

			fstream.on('finish', () => {
				sharp(tempPath)
					.resize({
						width: 150,
						height: 150,
						fit: sharp.fit.cover
					})
					.webp()
					.toFile(imagePath)
					.then(() => {
						fs.unlink(tempPath, e => e && logger.error(e))
						if (count++ === 0) {
							return resolve()
						}
					})
					.catch(err => {
						fs.unlink(tempPath, e => e && logger.error(e))
						if (count++ === 0) {
							return reject(new Error(err))
						}
					})
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
		.then(async () => {
			const user = await pg({
				query: 'select photo from users where id = $1::bigint',
				values: [req.session.user.id],
				object: true
			})

			if (user.photo !== null) {
				fs.unlink(path.resolve('public/avatars/', user.photo), e => e && logger.error(e))
			}

			await pg({
				query: 'update users set photo = $2::text where id = $1::bigint',
				values: [req.session.user.id, avatarName]
			})

			return res.status(200).send({url: `/avatars/${avatarName}`})
		})
		.catch(err => {
			logger.error(new Error(err))
			return res.status(500).send({message: 'Server error'})
		})
}

export default withIronSessionApiRoute(handler, ironSessionConfig)
