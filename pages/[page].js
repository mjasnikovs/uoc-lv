import {useState} from 'react'

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
	page: integerFormat({naturalNumber: true, notEmpty: true})
})

export const getServerSideProps = withIronSessionSsr(async ({req, params}) => {
	const page = (() => {
		if (typeof params === 'undefined') return 1
		const data = test(params)

		if (data instanceof Error) return 1
		return data.page
	})()

	const [session, articles, {totalPages}] = await Promise.all([
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
			limit 10 offset $1::bigint
	    `,
			values: [page * 10 - 10],
			object: false
		}).catch(err => logger.error(new Error(err))),
		pg({
			query: `
				select ceil(count(*)::int/10) as "totalPages" from articles where status = 'active'
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
			totalPages
		}
	}
}, ironSessionSettings)

const Index = ({session, articles, page, totalPages}) => {
	const router = useRouter()

	const pageNavigation = val => router.push(`/${val}`)

	return (
		<AppShellPage session={session}>
			{articles.map(article => (
				<ArticleCard key={article.id} {...article} />
			))}
			<Pagination page={page} onChange={pageNavigation} total={totalPages} radius='xs' color='indigo' />
		</AppShellPage>
	)
}

export default Index
