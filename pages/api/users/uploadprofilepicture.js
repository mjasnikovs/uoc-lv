import {withIronSessionApiRoute} from 'iron-session/next'
import ironSessionConfig from '../../../connections/ironSessionConfig'
import fs from 'fs'
import path from 'path'
import busboy from 'busboy'
import logger from '../../../connections/logger'
import pg from '../../../connections/pg'
import FormData from 'form-data'

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

	const imageHandler = new Promise((resolve, reject) => {
		const bb = busboy({headers: req.headers, limits: {files: 1, fileSize: 5 * 1048576}})
		let count = 0

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

			const body = new FormData()
			body.append('height', 150)
			body.append('width', 150)
			body.append('file', file, {
				filename,
				mimeType
			})

			fetch(`${process.env.FILESERVER_HOSTNAME}uploadimage`, {
				method: 'POST',
				body
			})
				.then(resp => {
					if (resp.ok) {
						return resp.json()
					}
					if (count++ === 0) {
						return reject(new Error(`HTTP status code: "${resp.status}" with message "${resp.statusText}"`))
					}
				})
				.then(resolve)
				.catch(err => {
					if (count++ === 0) {
						return reject(new Error(err))
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
		.then(async ({url}) => {
			const user = await pg({
				query: 'select photo from users where id = $1::bigint',
				values: [req.session.user.id],
				object: true
			})

			const body = new FormData()
			body.append('name', user.photo)

			await fetch(`${process.env.FILESERVER_HOSTNAME}delete`, {
				method: 'POST',
				body
			})

			await pg({
				query: 'update users set photo = $2::text where id = $1::bigint',
				values: [req.session.user.id, url]
			})

			return res.status(200).send({url})
		})
		.catch(err => {
			logger.error(err)
			return res.status(500).send({message: 'Server error'})
		})
}

export default withIronSessionApiRoute(handler, ironSessionConfig)
