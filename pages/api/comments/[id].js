import {format, integerFormat, stringFormat} from 'format-schema'
import {getApiRouteSession} from '../../../connections/ironSession'

import pg from '../../../connections/pg'
import logger from '../../../connections/logger'

const testGet = format({
	id: integerFormat({notEmpty: true, notUndef: true, notZero: true, naturalNumber: true})
})

const testPost = format({
	id: integerFormat({notEmpty: true, notUndef: true, max: 999, naturalNumber: true}),
	content: stringFormat({notEmpty: true, notUndef: true, trim: true})
})

const commentsHandler = (req, res) => {
	if (req.method === 'GET') {
		const args = testGet(req.query)

		if (args instanceof Error) {
			return res.status(400).send({error: args.message})
		}

		const {id} = args

		return pg({
			query: `select
					c.id,
					to_char(c."updatedAt" at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as "updatedAt",
					to_char(c."createdAt" at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as "createdAt",
					c."articleId",
					c."userId",
					u.name as "userName",
					u.photo as "userPhoto",
					c.content,
					c.likes
				from comments c
				left join users u on(u.id = c."userId")
				where c."articleId" = $1::bigint
			`,
			values: [id]
		})
			.then(coments => {
				return res.status(200).send(coments)
			})
			.catch(err => {
				logger.error(new Error(err))
				return res.status(500).send({error: 'Server error'})
			})
	} else if (req.method === 'POST') {
		if (typeof req.session.user === 'undefined') {
			return res.status(200).redirect(307, '/')
		}

		const args = testPost(req.body)

		if (args instanceof Error) {
			return res.status(400).send({error: args.message})
		}

		const {id, content} = args

		pg({
			query: 'update articles set "commentedAt" = NOW() where id = $1::bigint',
			values: [id]
		}).catch(err => logger.error(err))

		return pg({
			query: `
				with comment AS (
					insert into comments ("userId", "articleId", content)
					values ($1::bigint, $2::bigint, $3::text)
					RETURNING
						id,
						to_char("updatedAt" at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as "updatedAt",
						to_char("createdAt" at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as "createdAt",
						"articleId",
						"userId",
						content,
						likes
				)
				select 
					c.id,
					c."updatedAt",
					c."createdAt",
					c."articleId",
					c."userId",
					u.name as "userName",
					u.photo as "userPhoto",
					c.content,
					c.likes
				from comment c
				left join users u on(u.id = c."userId")

			`,
			values: [req.session.user.id, id, content],
			object: true
		})
			.then(coment => {
				return res.status(200).send(coment)
			})
			.catch(err => {
				logger.error(new Error(err))
				return res.status(500).send({error: 'Server error'})
			})
	}

	return res
		.status(404)
		.send({error: 'Route accepts only post or get requests. The non-post/get request was requested.'})
}

export default getApiRouteSession(commentsHandler)
