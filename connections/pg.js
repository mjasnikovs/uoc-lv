const {Client} = require('pg')

module.exports = select =>
	new Promise(async (resolve, reject) => {
		const client = new Client()
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

		const result = await client.query(query, values)
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
