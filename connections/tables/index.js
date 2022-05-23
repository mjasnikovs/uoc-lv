const {Client} = require('pg')

const timestampTrigger = require('./timestampTrigger')

const test = require('./test')
const users = require('./users')

const createPrerequisites = [timestampTrigger]
const createTables = [test, users]

;(async () => {
	const client = new Client({
		host: process.env.POSTGRES_HOST,
		port: process.env.POSTGRES_PORT,
		user: process.env.POSTGRES_USER,
		database: process.env.POSTGRES_DATABASE,
		password: process.env.POSTGRES_PASSWORD
	})
	await client.connect()
	await Promise.all(createPrerequisites.map(val => client.query(val)))
	await Promise.all(createTables.map(val => client.query(val)))
	await client.end()
	console.log('Database tables created')
})()
