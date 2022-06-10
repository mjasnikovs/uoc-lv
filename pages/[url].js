import {withIronSessionSsr} from 'iron-session/next'
import ironSessionConfig from '../connections/ironSessionConfig'
import pg from '../connections/pg'
import {strip} from '../connections/locales'

import {format, integerFormat} from 'format-schema'

import AppShellPage from '../components/AppShellPage'
import ArticleReader from '../components/ArticleReader'

import {NextSeo} from 'next-seo'

const test = format({
	articleId: integerFormat({naturalNumber: true, notEmpty: true, notZero: true})
})

export const getServerSideProps = withIronSessionSsr(async ({req, res, params}) => {
	const session = await new Promise(async (resolve, reject) => {
		if (typeof req.session.user === 'undefined' || typeof params.url === 'undefined') {
			return null
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

	const articleId = params.url.split('-').pop()
	const data = test({articleId})

	if (data instanceof Error) {
		res.statusCode = 302
		res.setHeader('location', '/')
		res.end()
		return {
			props: {
				session
			}
		}
	}

	const article = await pg({
		query: `
			select
				a.id,
				to_char(a."updatedAt" at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as "updatedAt",
				to_char(a."createdAt" at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as "createdAt",
				to_char(a."publishedAt" at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as "publishedAt",
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
				a.mp3
			from articles a
			left join users u on(u.id = a."userId")
			where a.id = $1
	    `,
		values: [data.articleId],
		object: true
	})

	return {
		props: {
			session,
			article
		}
	}
}, ironSessionConfig)

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
			<ArticleReader {...article} />
		</AppShellPage>
	</>
)

export default Editor
