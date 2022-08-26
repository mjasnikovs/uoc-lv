import {withIronSessionSsr} from 'iron-session/next'

import {NextSeo} from 'next-seo'

import {format, integerFormat} from 'format-schema'

import {ironSessionSettings, getSession} from '../../connections/ironSession'
import {strip} from '../../connections/locales'
import pg from '../../connections/pg'
import logger from '../../connections/logger'

import AppShellPage from '../../components/shell/AppShellPage'
import ArticleReader from '../../components/articles/ArticleReader'

const test = format({
	articleId: integerFormat({naturalNumber: true, notEmpty: true, notZero: true})
})

export const getServerSideProps = withIronSessionSsr(async ({req, res, params}) => {
	const articleId = params.url.split('-').pop()
	const data = test({articleId})

	if (data instanceof Error) {
		res.statusCode = 302
		res.setHeader('location', '/')
		res.end()
		return {
			props: {
				session: null
			}
		}
	}

	const [session, article] = await Promise.all([
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
					u.photo as "userPhoto",
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
				where a.id = $1
	    	`,
			values: [data.articleId],
			object: true
		}).catch(err => logger.error(new Error(err)))
	])

	console.log(article)

	if (article === null) {
		res.statusCode = 302
		res.setHeader('location', '/')
		res.end()
		return {
			props: {
				session
			}
		}
	}

	return {
		props: {
			session,
			article
		}
	}
}, ironSessionSettings)

const Editor = ({session, article}) => (
	<>
		<NextSeo
			title={article.title}
			description={strip(article.article)}
			openGraph={{
				title: article.title,
				description: strip(article.article),
				url: `${process.env.NEXT_PUBLIC_HOSTNAME}${article.url}`,
				type: 'article',
				article: {
					publishedTime: article.publishedAt,
					modifiedTime: article.updatedAt,
					tags: article.tags
				},
				images: [
					{
						url: article.thumbnail
							? `${process.env.NEXT_PUBLIC_CDN}${article.thumbnail}`
							: '/placeholder.png',
						width: 864,
						height: 486,
						alt: article.title
					}
				]
			}}
		/>
		<AppShellPage session={session}>
			<ArticleReader session={session} {...article} />
		</AppShellPage>
	</>
)

export default Editor
