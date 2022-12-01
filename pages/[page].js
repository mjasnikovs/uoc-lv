import {withIronSessionSsr} from 'iron-session/next'
import {useRouter} from 'next/router'

import {ironSessionSettings, getSession} from '../connections/ironSession'
import logger from '../connections/logger'
import pg from '../connections/pg'

import {Pagination} from '@mantine/core'

import {format, integerFormat} from 'format-schema'

import AppShellPage from '../components/shell/AppShellPage'
import ArticleCard from '../components/articles/ArticleCard'

const test = format({
	page: integerFormat({naturalNumber: true, notZero: true, notEmpty: true})
})

export const getServerSideProps = withIronSessionSsr(async ({req, params}) => {
	const page = (() => {
		if (typeof params === 'undefined') return 1
		const data = test(params)

		if (data instanceof Error) return 1
		return data.page
	})()

	const [session, articles, {totalArticles}] = await Promise.all([
		getSession(req),
		pg({
			query: `
			select
				a.id,
				to_char(a."updatedAt" at time zone 'EETDST', 'DD.MM.YYYY HH24:MI') as "updatedAt",
				to_char(a."createdAt" at time zone 'EETDST', 'DD.MM.YYYY HH24:MI') as "createdAt",
				to_char(a."publishedAt" at time zone 'EETDST', 'DD.MM.YYYY HH24:MI') as "publishedAt",
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
				a."thumbnailBlur",
				a.mp3
			from articles a
			left join users u on(u.id = a."userId")
			where status = 'active'
			order by a."createdAt" DESC
			limit 10 offset $1::bigint
	    `,
			values: [page * 10 - 10],
			object: false
		}).catch(err => logger.error(new Error(err))),
		pg({
			query: `
				select count(*) as "totalArticles" from articles where status = 'active'
			`,
			values: [],
			object: true
		}).catch(err => logger.error(new Error(err)))
	])

	return {
		props: {
			session,
			articles,
			page,
			totalPages: Math.ceil(totalArticles / 10)
		}
	}
}, ironSessionSettings)

const Index = ({session, articles, page, totalPages}) => {
	const router = useRouter()

	const pageNavigation = val => router.push(`/${val}`)

	return (
		<AppShellPage session={session}>
			{articles.map((article, count) => (
				<ArticleCard key={article.id} {...article} count={count} />
			))}
			<Pagination
				page={page}
				onChange={pageNavigation}
				total={totalPages}
				aria-label='pagination'
				getItemAriaLabel={p => {
					if (p === 'dots') {
						return 'dots element'
					} else if (p === 'prev') {
						return 'previous page'
					} else if (p === 'next') {
						return 'next page'
					} else if (p === 'first') {
						return 'first page'
					} else if (p === 'last') {
						return 'last page'
					}
					return `${page} item`
				}}
				radius='xs'
				color='indigo'
			/>
		</AppShellPage>
	)
}

export default Index
