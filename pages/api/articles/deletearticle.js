import {format, integerFormat} from 'format-schema'

import logger from '../../../connections/logger'
import pg from '../../../connections/pg'
import {getApiRouteSession} from '../../../connections/ironSession'

import fs from 'fs'
import path from 'path'

const test = format({
	id: integerFormat({naturalNumber: true, notEmpty: true, notZero: true})
})

const deleteArticlehandler = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(404).send({error: 'Route accepts only post requests. The non-post request was requested.'})
	}

	if (typeof req.session.user === 'undefined') {
		return res.status(200).redirect(307, '/')
	}

	return new Promise(async (resolve, reject) => {
		const props = test(req.body)

		if (props instanceof Error) {
			return reject(new Error(props))
		}

		const {id} = props

		const article = await pg({
			query: 'select "userId", article, thumbnail from articles where id = $1::bigint limit 1',
			values: [id],
			object: true
		})

		if (article === null) {
			return reject(
				new Error(`Sessions don't have appropriate article id.
					The article can't be deleted.`)
			)
		}

		if (req.session.user.privileges !== 'administrator' && req.session.user.id !== article.userId) {
			return reject(
				new Error(`Sessions don't have appropriate privileges.
					The article can't be deleted.`)
			)
		}

		const imageSearch = article.article.matchAll(/src="(?:.*?)(?:\/\/)(?:.*?)(?:\/)(.*?\.webp)"/gm)

		const deleteImages = [article.thumbnail, ...[...imageSearch].map(thumb => thumb[1])]

		await Promise.all(
			deleteImages.map(img => {
				return new Promise(cb =>
					fs.unlink(path.resolve('public/cdn/', img), err => {
						if (err) {
							logger.error(err)
						}
						return cb()
					})
				)
			})
		)

		return pg({
			query: `
					delete from articles
					where id = $1::bigint
					RETURNING
					*
				`,
			values: [id],
			object: true
		})
			.then(resolve)
			.catch(err => reject(new Error(err)))
	})
		.then(article => {
			return res.status(200).send(article)
		})
		.catch(err => {
			logger.error(err)
			return res.status(500).send({error: err.message})
		})
}

export default getApiRouteSession(deleteArticlehandler)
