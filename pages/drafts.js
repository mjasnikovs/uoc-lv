import {Grid, Container, Title, Button} from '@mantine/core'
import News from 'tabler-icons-react/dist/icons/news'

import {withIronSessionSsr} from 'iron-session/next'
import Link from 'next/link'
import Head from 'next/head'

import {ironSessionSettings, getSession} from '../connections/ironSession'
import pg from '../connections/pg'

import AppShellPage from '../components/shell/AppShellPage'
import ArticleCard from '../components/articles/ArticleCard'

export const getServerSideProps = withIronSessionSsr(async ({req, res}) => {
	const session = await getSession(req)

	if (session === null) {
		res.statusCode = 302
		res.setHeader('location', '/')
		res.end()
		return {
			props: {
				session: null
			}
		}
	}

	const articles = await pg({
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
			where status != 'active'
			order by a."createdAt" DESC
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
}, ironSessionSettings)

const Drafts = ({session, articles}) => (
	<>
		<Head>
			<title>Melnraksti</title>
		</Head>
		<AppShellPage session={session}>
			<Container size='xl'>
				<Grid>
					<Grid.Col span={8}>
						<Title order={2}>Melnrakstis</Title>
					</Grid.Col>
					<Grid.Col span={4}>
						<Link href='/editor/0' passHref={true}>
							<Button leftIcon={<News />} variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
								Izveidot jaunu
							</Button>
						</Link>
					</Grid.Col>
					<Grid.Col span={12}>
						{articles.map(article => (
							<ArticleCard editLink key={article.id} {...article} />
						))}
					</Grid.Col>
				</Grid>
			</Container>
		</AppShellPage>
	</>
)

export default Drafts
