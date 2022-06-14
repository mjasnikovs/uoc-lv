import AppShellPage from '../components/AppShellPage'
import ArticleCard from '../components/ArticleCard'

import {withIronSessionSsr} from 'iron-session/next'
import ironSessionConfig from '../connections/ironSessionConfig'
import pg from '../connections/pg'

export const getServerSideProps = withIronSessionSsr(async ({req}) => {
	const session = await new Promise(async (resolve, reject) => {
		if (typeof req.session.user === 'undefined') {
			return resolve(null)
		}

		const {id, token} = req.session.user

		pg({
			query: `
			select id, email, photo, name, privileges from users
			where id = $1::bigint and token = $2::text
			limit 1
	    `,
			values: [id, token],
			object: true
		})
			.then(resolve)
			.catch(reject)
	})

	const articles = await pg({
		query: `
			select
				a.id,
				to_char(a."updatedAt" at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as "updatedAt",
				to_char(a."createdAt" at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as "createdAt",
				to_char(a."publishedAt" at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as "publishedAt",
				a."userId",
				u.name as "userName",
				a.url,
				a.title,
				a.tags,
				a.category,
				a.status,
				a.article,
				a.notes,
				a.thumbnail,
				a.mp3
			from articles a
			left join users u on(u.id = a."userId")
			where status = 'active'
			order by a."createdAt" DESC
			limit 10
	    `,
		values: [],
		object: false
	})

	return {
		props: {
			session,
			articles
		}
	}
}, ironSessionConfig)

const Index = ({session, articles}) => (
	<AppShellPage session={session}>
		{articles.map(article => (
			<ArticleCard key={article.id} {...article} />
		))}
	</AppShellPage>
)

export default Index
