import {withIronSessionSsr} from 'iron-session/next'

import {ironSessionSettings, getSession} from '../connections/ironSession'
import logger from '../connections/logger'
import pg from '../connections/pg'

import AppShellPage from '../components/AppShellPage'
import ArticleCard from '../components/ArticleCard'

export const getServerSideProps = withIronSessionSsr(async ({req}) => {
	const [session, articles] = await Promise.all([
		getSession(req),
		pg({
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
		}).catch(err => logger.error(new Error(err)))
	])

	return {
		props: {
			session,
			articles
		}
	}
}, ironSessionSettings)

const Index = ({session, articles}) => (
	<AppShellPage session={session}>
		{articles.map(article => (
			<ArticleCard key={article.id} {...article} />
		))}
	</AppShellPage>
)

export default Index
