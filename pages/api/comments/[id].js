import {format, integerFormat, stringFormat} from 'format-schema'
import {getApiRouteSession} from '../../../connections/ironSession'

import pg from '../../../connections/pg'
import logger from '../../../connections/logger'

const testGet = format({
	id: integerFormat({notEmpty: true, notUndef: true, notZero: true, naturalNumber: true})
})

const testPost = format({
	id: integerFormat({notEmpty: true, notUndef: true, naturalNumber: true}),
	content: stringFormat({notEmpty: true, notUndef: true, trim: true})
})

const testPatch = format({
	id: integerFormat({notEmpty: true, notUndef: true, naturalNumber: true}),
	commentId: integerFormat({notEmpty: true, notUndef: true, naturalNumber: true}),
	content: stringFormat({notEmpty: true, notUndef: true, trim: true})
})

const commentsHandler = async (req, res) => {
	if (req.method === 'GET') {
		const args = testGet(req.query)

		if (args instanceof Error) {
			return res.status(400).send({error: args.message})
		}

		const {id} = args

		return pg({
			query: `select
					c.id,
					to_char(c."updatedAt" at time zone 'EETDST', 'DD.MM.YYYY HH24:MI') as "updatedAt",
					to_char(c."createdAt" at time zone 'EETDST', 'DD.MM.YYYY HH24:MI') as "createdAt",
					c."articleId",
					c."userId",
					u.name as "userName",
					u.photo as "userPhoto",
					c.content,
					c.likes
				from comments c
				left join users u on(u.id = c."userId")
				where c."articleId" = $1::bigint
				order by c."createdAt" DESC
			`,
			values: [id]
		})
			.then(comments => {
				return res.status(200).send(comments)
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
					    to_char("updatedAt" at time zone 'EETDST', 'DD.MM.YYYY HH24:MI') as "updatedAt",
					    to_char("createdAt" at time zone 'EETDST', 'DD.MM.YYYY HH24:MI') as "createdAt",
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
				order by c."createdAt" DESC

			`,
			values: [req.session.user.id, id, content],
			object: true
		})
			.then(comment => {
				return res.status(200).send(comment)
			})
			.catch(err => {
				logger.error(new Error(err))
				return res.status(500).send({error: 'Server error'})
			})
	} else if (req.method === 'PATCH') {
		if (typeof req.session.user === 'undefined') {
			return res.status(200).redirect(307, '/')
		}

		const args = testPatch(req.body)

		if (args instanceof Error) {
			return res.status(400).send({error: args.message})
		}

		const {id, content, commentId} = args

		const commentUser = await pg({
			query: 'select "userId" from comments where id = $1::bigint and "articleId" = $2::bigint limit 1',
			values: [commentId, id],
			object: true
		})

		if (commentUser === null) {
			return res.status(400).send({
				error: `Sessions don't have appropriate comment id.
					The comment can't be updated.`
			})
		}

		if (req.session.user.privileges !== 'administrator' && commentUser.userId !== req.session.user.id) {
			return res.status(400).send({
				error: `Sessions don't have appropriate privileges.
					The comment can't be updated.`
			})
		}

		return pg({
			query: `
				with comment AS (
                    update comments set content = $2::text
                    where id = $1::bigint
					RETURNING
						id,
					    to_char("updatedAt" at time zone 'EETDST', 'DD.MM.YYYY HH24:MI') as "updatedAt",
					    to_char("createdAt" at time zone 'EETDST', 'DD.MM.YYYY HH24:MI') as "createdAt",
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
				order by c."createdAt" DESC
			`,
			values: [commentId, content],
			object: true
		})
			.then(comment => {
				return res.status(200).send(comment)
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
