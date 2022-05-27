import {Grid, Center, Container, Title, TextInput, Avatar, InputWrapper, Group, Anchor, Button} from '@mantine/core'

import {Dropzone, MIME_TYPES} from '@mantine/dropzone'

import {useForm} from '@mantine/form'
import {useState} from 'react'
import AppShellPage from '../components/AppShellPage'
import ErrorBox from '../components/ErrorBox'
import DropBox from '../components/DropBox'
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

	return {
		props: {
			session
		}
	}
}, ironSessionConfig)

const CreateNewAccount = ({session}) => {
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
							<Link href={`${process.env.NEXT_PUBLIC_HOSTNAME}editor`} passHref>
								<Button leftIcon={<News />} variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
									Izveidot jaunu
								</Button>
							</Link>
						</Grid.Col>
					</Grid>
				</Container>
			</AppShellPage>
		</>
	)
}

export default CreateNewAccount
