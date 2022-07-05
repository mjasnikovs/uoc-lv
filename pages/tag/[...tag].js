import {withIronSessionSsr} from 'iron-session/next'
import {useRouter} from 'next/router'
import Link from 'next/link'

import {ironSessionSettings, getSession} from '../../connections/ironSession'
import logger from '../../connections/logger'
import pg from '../../connections/pg'

import {Pagination, Title, Space, Anchor, Alert} from '@mantine/core'
import AlertCircle from 'tabler-icons-react/dist/icons/alert-circle'

import {format, integerFormat, stringFormat} from 'format-schema'

import AppShellPage from '../../components/shell/AppShellPage'
import ArticleCard from '../../components/articles/ArticleCard'

const testPage = format({
	page: integerFormat({naturalNumber: true, notEmpty: true, notZero: true})
})

const testTag = format({
	tag: stringFormat({trim: true, toLowerCase: true, notEmpty: true})
})

export const getServerSideProps = withIronSessionSsr(async ({req, params}) => {
	const page = (() => {
		if (typeof params === 'undefined') return 1
		const data = testPage({page: params.tag[1]})

		if (data instanceof Error) return 1
		return data.page
	})()

	const tag = (() => {
		if (typeof params === 'undefined') return ''
		const data = testTag({tag: params.tag[0]})

		if (data instanceof Error) return ''
		return data.tag
	})()

	const [session, articles, {totalArticles}] = await Promise.all([
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
				a."thumbnailBlur",
				a.mp3
			from articles a
			left join users u on(u.id = a."userId")
			where status = 'active' and $1::text = any("slugTags")
			order by a."createdAt" DESC
			limit 10 offset $2::bigint
	    `,
			values: [tag, page * 10 - 10],
			object: false
		}).catch(err => logger.error(new Error(err))),
		pg({
			query: `
				select count(*)::int as "totalArticles"
				from articles
				where status = 'active' and $1::text = any("slugTags")
			`,
			values: [tag],
			object: true
		}).catch(err => logger.error(new Error(err)))
	])

	return {
		props: {
			session,
			articles,
			tag,
			page,
			totalPages: Math.ceil(totalArticles / 10)
		}
	}
}, ironSessionSettings)

const Index = ({session, articles, tag, page, totalPages}) => {
	const router = useRouter()

	const pageNavigation = val => router.push(`/tag/${tag}/${val}`)

	return (
		<AppShellPage session={session}>
			<Title order={1}>Meklēšana</Title>
			<Space h='xl' />
			{articles.length === 0 && (
				<Alert icon={<AlertCircle size={16} />} title='Tukšums!' color='cyne'>
					Diemžēl pēc Jūsu meklētās frāzes &quot;{tag}&quot; nekas netika atrasts. Mēģiniet vēlreiz ar citu
					atslēgas vārdu.
					<br /> Piemērs: &nbsp;
					<Link href='/tag/podkasts' passHref={true}>
						<Anchor variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
							podkāsts
						</Anchor>
					</Link>
				</Alert>
			)}
			{articles.map(article => (
				<ArticleCard key={article.id} {...article} />
			))}
			{totalPages > 0 && (
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
			)}
		</AppShellPage>
	)
}

export default Index
