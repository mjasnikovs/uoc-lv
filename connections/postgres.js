import crypto from 'crypto'
import {Pool} from 'pg'

import {createPrerequisites, createTables} from './tables'

const dataTypes = [
	'bigint',
	'bigint[]',
	'int8',
	'bigserial',
	'serial8',
	'bit',
	'bit varying',
	'varbit',
	'boolean',
	'bool',
	'box',
	'bytea',
	'character',
	'character varying',
	'character varying[]',
	'char',
	'character',
	'varchar',
	'varchar[]',
	'cidr',
	'circle',
	'date',
	'double precision',
	'float8',
	'inet',
	'int',
	'int4',
	'interval',
	'json',
	'jsonb',
	'line',
	'lseg',
	'macaddr',
	'money',
	'numeric',
	'decimal',
	'path',
	'pg_lsn',
	'point',
	'polygon',
	'real',
	'float4',
	'smallint',
	'int2',
	'smallserial',
	'serial2',
	'serial',
	'serial4',
	'text',
	'text[]',
	'time',
	'time without time zone',
	'time with time zone',
	'timetz',
	'timestamp without time zone',
	'timestamp with time zone',
	'timestamptz',
	'tsquery',
	'tsvector',
	'txid_snapshot',
	'uuid',
	'xml',
	'improvements_statuses_type',
	'sios_statuses_type',
	'sios_category_type'
]

const pool = new Pool({
	host: process.env.POSTGRES_HOST,
	port: process.env.POSTGRES_PORT,
	user: process.env.POSTGRES_USER,
	database: process.env.POSTGRES_DATABASE,
	password: process.env.POSTGRES_PASSWORD,
	max: 2,
	idleTimeoutMillis: 60000,
	connectionTimeoutMillis: 2000
})

pool.connect(async (error, client, release) => {
	if (error) {
		throw new Error(error)
	}

	console.log('Creating tables')

	await Promise.all(createPrerequisites.map(prerequisite => client.query(prerequisite))).catch(err => {
		throw new Error(err)
	})

	await Promise.all(createTables.map(table => client.query(table))).catch(err => {
		throw new Error(err)
	})

	release()

	console.log('Tables created')
})

module.exports = select =>
	new Promise((resolve, reject) => {
		const {query, types, values, object} = (() => {
			if (typeof select === 'string') {
				return {
					query: select,
					types: [],
					values: [],
					object: false
				}
			}
			return {
				query: select.query,
				types: typeof select.types === 'undefined' ? [] : select.types,
				values: typeof select.values === 'undefined' ? [] : select.values,
				object: select.object === 'undefined' ? false : select.object
			}
		})()

		if (!Array.isArray(types)) {
			return reject(new Error('Postgres query function error, "types" params is not array'))
		}

		if (!Array.isArray(values)) {
			return reject(new Error('Postgres query function error, "values" params is not array'))
		}

		if (types.length !== values.length) {
			return reject(
				new Error(
					`Postgres query function error, "types".length = ${types.length} not equal to "values".length = ${values.length}`
				)
			)
		}

		if (types.length) {
			const invalidDataType = types.find(val => dataTypes.indexOf(val) === -1)

			if (typeof invalidDataType !== 'undefined') {
				return reject(new Error(`Invalid dataType: ${invalidDataType}`))
			}
		}

		const name = `Q${crypto.createHmac('sha256', 'q').update(query).digest('hex')}`

		pool.connect((error, client, release) => {
			if (error) {
				return reject(new Error(error))
			}

			if (!client.PREPARED) {
				client.PREPARED = new Set()
			}

			const queryString = (() => {
				if (values.length > 0) {
					return `(${values.map(val => {
						if (val === null || typeof val === 'undefined') {
							return 'null'
						}
						return `'${String(val).replace(/'/g, "''")}'`
					})})`
				}
				return ''
			})()

			if (client.PREPARED.has(name)) {
				return client.query(`execute ${name} ${queryString};`, [], (err, result) => {
					release()
					if (err) {
						return reject(new Error(err))
					}

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
			}

			client.PREPARED.add(name)

			const typesString = types.length ? `(${types.toString()})` : ''

			return client.query(
				`prepare ${name} ${typesString} as ${query}; execute ${name} ${queryString};`,
				[],
				(err, result) => {
					release()
					if (err) {
						return reject(new Error(err))
					}

					if (object === true) {
						if (result[1].rowCount === 1) {
							return resolve(result[1].rows[0])
						}
						return resolve(null)
					}

					if (result[1].rowCount) {
						return resolve(result[1].rows)
					}

					return resolve([])
				}
			)
		})
	})
