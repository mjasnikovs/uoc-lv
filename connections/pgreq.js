const postgres = require('pg')
const Client = postgres.Client

const pg = select =>
	new Promise(async (resolve, reject) => {
		const client = new Client({
			host: process.env.POSTGRES_HOST,
			port: process.env.POSTGRES_PORT,
			user: process.env.POSTGRES_USER,
			database: process.env.POSTGRES_DATABASE,
			password: process.env.POSTGRES_PASSWORD
		})

		await client.connect()

		const {query, values, object} = (() => {
			if (typeof select === 'string') {
				return {
					query: select,
					values: [],
					object: false
				}
			}
			return {
				query: select.query,
				values: typeof select.values === 'undefined' ? [] : select.values,
				object: select.object === 'undefined' ? false : select.object
			}
		})()

		if (!Array.isArray(values)) {
			return reject(new Error('Postgres query function error, "values" params is not array'))
		}

		return client
			.query(query, values)
			.then(result => {
				client.end()
				if (object === true) {
					if (result.rowCount === 1) {
						return resolve(result.rows[0])
					}
					return resolve(null)
				}

				if (result.rowCount) {
					return resolve(result.rows)
				}

				return resolve([])
			})
			.catch(err => {
				client.end()
				return reject(err)
			})
	})

module.exports = pg
