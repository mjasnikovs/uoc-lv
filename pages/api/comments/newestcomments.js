import pg from '../../../connections/pg'
import logger from '../../../connections/logger'

const newestCommentsHandler = (req, res) => {
	if (req.method === 'GET') {
		return pg({
			query: `
				with art AS (
					select
						a.id,
						a.title,
						a.url,
						(select count(*) from comments c where "articleId" = a.id) as count,
						(select "userId" from comments c where "articleId" = a.id order by c."createdAt" DESC limit 1) as "userId",
                        a."commentedAt"
					from articles a
					where a.status = 'active'
					group by a.id
					order by a."commentedAt" DESC NULLS LAST
					limit 10
				)
				select
					a.id,
					a.title,
					a.url,
					a.count,
					a."userId",
                    a."commentedAt",
					u.name as "userName",
					u.photo as "userPhoto"
				from art a
				left join users u on (u.id = a."userId")
			`,
			values: []
		})
			.then(comments => {
				return res.status(200).send(comments)
			})
			.catch(err => {
				logger.error(new Error(err))
				return res.status(500).send({error: 'Server error'})
			})
	}

	return res.status(404).send({error: 'Route accepts only get requests. The non-get request was requested.'})
}

export default newestCommentsHandler
