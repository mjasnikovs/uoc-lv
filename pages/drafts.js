import {Grid, Center, Container, Title, TextInput, Avatar, InputWrapper, Group, Anchor, Button} from '@mantine/core'

import {Dropzone, MIME_TYPES} from '@mantine/dropzone'

import {useForm} from '@mantine/form'
import {useState} from 'react'
import AppShellPage from '../components/AppShellPage'
import ErrorBox from '../components/ErrorBox'
import DropBox from '../components/DropBox'
import ArticleCard from '../components/ArticleCard'
import {List, News} from 'tabler-icons-react'

import {useRouter} from 'next/router'
import {withIronSessionSsr} from 'iron-session/next'
import ironSessionConfig from '../connections/ironSessionConfig'
import pg from '../connections/pg'

import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'

export const getServerSideProps = withIronSessionSsr(async ({req, res}) => {
	if (typeof req.session.user === 'undefined') {
		res.statusCode = 301
		res.setHeader('Location', '/')
		res.end()
		return {
			props: {
				session: null
			}
		}
	}

	const {id, token} = req.session.user

	const session = await pg({
		query: `
			select id, email, photo, name, privileges from users
			where id = $1::bigint and token = $2::text
			limit 1
	    `,
		values: [id, token],
		object: true
	})

	if (session === null) {
		res.statusCode = 301
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
}, ironSessionConfig)

const CreateNewAccount = ({session, articles}) => {
	const router = useRouter()

	if (session === null) {
		return router.push('/')
	}

	return (
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
							<Link href={`${process.env.NEXT_PUBLIC_HOSTNAME}editor/0`} passHref>
								<Button leftIcon={<News />} variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
									Izveidot jaunu
								</Button>
							</Link>
						</Grid.Col>
						<Grid.Col span={12}>
							{articles.map(article => (
								<ArticleCard key={article.id} {...article} />
							))}
						</Grid.Col>
					</Grid>
				</Container>
			</AppShellPage>
		</>
	)
}

export default CreateNewAccount
