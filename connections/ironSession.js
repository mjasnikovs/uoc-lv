import {withIronSessionSsr, withIronSessionApiRoute} from 'iron-session/next'
import pg from '../connections/pg'
import logger from '../connections/logger'

import {format, integerFormat, stringFormat} from 'format-schema'

const test = format({
	id: integerFormat({naturalNumber: true, notEmpty: true, notZero: true}),
	token: stringFormat({notEmpty: true, trim: true})
})

export const ironSessionSettings = {
	cookieName: 'uoclv',
	password: process.env.COOKIESALT,
	cookieOptions: {
		secure: process.env.NODE_ENV === 'production'
	}
}

export const getApiRouteSession = api => withIronSessionApiRoute(api, ironSessionSettings)

export const getSession = req =>
	new Promise(resolve => {
		if (typeof req.session.user === 'undefined') {
			return resolve(null)
		}

		const user = test(req.session.user)

		if (user instanceof Error) {
			logger.info(new Error(user))
			return resolve(null)
		}

		const {id, token} = user

		pg({
			query: `
			select id, name, photo from users
			where id = $1::bigint and token = $2::text
			limit 1
		`,
			values: [id, token],
			object: true
		})
			.then(resolve)
			.catch(err => {
				logger.error(new Error(err))
				return resolve(null)
			})
	})

export const getServerSideProps = withIronSessionSsr(async ({req}) => {
	const session = await getSession(req)
	return {
		props: {
			session
		}
	}
}, ironSessionSettings)
