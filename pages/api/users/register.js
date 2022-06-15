import pg from '../../../connections/pg'
import logger from '../../../connections/logger'
import {format, stringFormat, integerFormat} from 'format-schema'
const crypto = require('crypto')

const test = format({
	name: stringFormat({notEmpty: true, notUndef: true, trim: true, min: 3, max: 200}),
	email: stringFormat({notEmpty: true, notUndef: true, trim: true, email: true, toLowerCase: true, min: 8, max: 200}),
	password: stringFormat({notEmpty: true, notUndef: true, trim: true, min: 6, max: 200}),
	robo: integerFormat({notEmpty: true, notUndef: true, max: 999, naturalNumber: true})
})

const registerHandler = async (req, res) => {
	if (req.method === 'POST') {
		const args = test(req.body.values)

		if (args instanceof Error) {
			return res.status(400).send({error: args.message})
		}

		const {name, email, password, robo} = args

		if (robo !== 2) {
			return res.status(400).send({error: 'Ievades dati nav korektā formātā.'})
		}

		const userCheck = await pg({
			query: 'select from users where name = $1::text or email = $2::text limit 1',
			values: [name, email],
			object: true
		}).catch(err => {
			logger.error(new Error(err))
			return res.status(500).send({error: 'Server error'})
		})

		if (userCheck !== null) {
			return res.status(400).send({error: 'Lietotāja segvārds vai epasts jau eksistē.'})
		}

		const securePassword = crypto.createHmac('sha512', process.env.SALT).update(password).digest('hex')

		await pg({
			query: 'insert into users (name, email, password) values ($1::text, $2::text, $3::text)',
			values: [name, email, securePassword]
		}).catch(err => {
			logger.error(new Error(err))
			return res.status(500).send({error: 'Server error'})
		})

		return res.status(200).send({message: 'Apsveicu, tavs konts ir reģistrēts.'})
	}
	return res.status(404).send({error: 'Route accepts only post requests. The non-post request was requested.'})
}

export default registerHandler
