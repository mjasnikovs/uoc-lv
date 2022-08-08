import pg from '../../../connections/pg'
import logger from '../../../connections/logger'
import {getApiRouteSession} from '../../../connections/ironSession'

import {format, stringFormat} from 'format-schema'

const crypto = require('crypto')

const test = format({
	email: stringFormat({notEmpty: true, notUndef: true, trim: true, email: true, toLowerCase: true, min: 8, max: 200}),
	password: stringFormat({notEmpty: true, notUndef: true, trim: true, min: 6, max: 200})
})

const loginRoute = async (req, res) => {
	if (req.method === 'POST') {
		const args = test(req.body.values)

		if (args instanceof Error) {
			return res.status(400).send({error: 'Ievades dati nav korektā formātā.'})
		}

		const {email, password} = args

		const user = await pg({
			query: 'select id, email, name, password, privileges from users where email = $1::text limit 1',
			values: [email],
			object: true
		}).catch(err => {
			logger.error(new Error(err))
			return res.status(500).send({error: 'Server error'})
		})

		if (user === null) {
			return res.status(400).send({error: 'Konts nav atrasts vai ievadītie dati nav pareizi.'})
		}

		const securePassword = crypto.createHmac('sha512', process.env.SALT).update(password).digest('hex')

		if (securePassword !== user.password) {
			return res.status(400).send({error: 'Konts nav atrasts vai ievadītie dati nav pareizi.'})
		}

		const tokenOffset = Math.floor(Math.random() * (80 - 0 + 1)) + 0

		const token = crypto
			.createHmac('sha512', process.env.COOKIESALT)
			.update(user.password + user.email + user.id + new Date())
			.digest('hex')
			.slice(0 + tokenOffset, 32 + tokenOffset)

		await pg({
			query: 'update users set token = $1::text where id = $2::bigint',
			values: [token, user.id]
		}).catch(err => {
			logger.error(new Error(err))
			return res.status(500).send({error: 'Server error'})
		})

		req.session.user = {
			id: user.id,
			name: user.name,
			privileges: user.privileges,
			token
		}

		await req.session.save()

		return res.status(200).send({message: 'Apsveicu, tavs konts ir savienots.'})
	}
	return res.status(404).send({error: 'Route accepts only post requests. The non-post request was requested.'})
}

export default getApiRouteSession(loginRoute)
