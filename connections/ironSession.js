import {withIronSessionSsr} from 'iron-session/next'
import ironSessionConfig from '../connections/ironSessionConfig'
import pg from '../connections/pg'

const getServerSideProps = withIronSessionSsr(async ({req}) => {
	if (typeof req.session.user === 'undefined') {
		return {
			props: {
				session: null
			}
		}
	}

	const {id, token} = req.session.user

	const session = await pg({
		query: `
			select id, name from users
			where id = $1::bigint and token = $2::text
			limit 1
		`,
		values: [id, token],
		object: true
	})

	if (session === null) {
		return {
			props: {
				session: null
			}
		}
	}

	return {
		props: {
			session
		}
	}
}, ironSessionConfig)

export default getServerSideProps
