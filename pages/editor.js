import {useState} from 'react'

import {withIronSessionSsr} from 'iron-session/next'
import ironSessionConfig from '../connections/ironSessionConfig'
import pg from '../connections/pg'
import {useRouter} from 'next/router'

import AppShellPage from '../components/AppShellPage'
import ArticleEditor from '../components/ArticleEditor'
import ErrorBox from '../components/ErrorBox'
import DropBox from '../components/DropBox'

import {Grid, Container, TextInput, Select, Button, Center, Textarea, Image as ImageContainer} from '@mantine/core'
import {Dropzone, MIME_TYPES} from '@mantine/dropzone'
import {Check} from 'tabler-icons-react'

import Head from 'next/head'
import Image from 'next/image'
import {useForm} from '@mantine/form'

export const getServerSideProps = withIronSessionSsr(async ({req, res}) => {
	if (typeof req.session.user === 'undefined') {
		res.statusCode = 302
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
		res.statusCode = 302
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

const SideBar = ({form}) => {
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(null)
	const [thumbnail, setThumbnail] = useState(null)

	const handleProfilePictureSubmit = files => {
		setError(null)
		setLoading(true)

		const formData = new FormData()
		formData.append('file', files[0])
		formData.append('type', 'thumbnail')

		fetch('/api/uploadpicture', {
			method: 'POST',
			body: formData
		})
			.then(res => res.json())
			.then(res => {
				setLoading(false)
				if (typeof res.error !== 'undefined') {
					return setError(res.error)
				}
				form.setFieldValue('thumbnail', res.url)
				return setThumbnail(`${process.env.NEXT_PUBLIC_CDN}${res.url}`)
			})
			.catch(err => {
				setLoading(false)
				return setError(err.message)
			})
	}

	return (
		<Container>
			<Grid>
				<Grid.Col span={12}>
					<label>Titilbilde</label>
				</Grid.Col>
				{thumbnail && (
					<Grid.Col span={12}>
						<Center>
							<Image as={ImageContainer} src={thumbnail} alt='titulbilde' width='384' height='216' />
						</Center>
					</Grid.Col>
				)}
				<Grid.Col span={12}>
					<ErrorBox error={error} />
					<Dropzone
						loading={loading}
						multiple={false}
						onDrop={handleProfilePictureSubmit}
						onReject={() => setError('Faila/u augšuplāde neizdevās.')}
						maxSize={3 * 1024 ** 2}
						accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
					>
						{status => DropBox(status)}
					</Dropzone>
				</Grid.Col>
				{form.getInputProps('category').value === 'podkasts' && (
					<>
						<Grid.Col span={12}>
							<label>Mp3 saite</label>
						</Grid.Col>
						<Grid.Col>
							<TextInput id='mp3' {...form.getInputProps('mp3')} />
						</Grid.Col>
					</>
				)}
				<Grid.Col>
					<Textarea
						size='md'
						{...form.getInputProps('notes')}
						placeholder='Tavs komentārs?'
						label='Piezīmes'
						autosize
						minRows={5}
					/>
				</Grid.Col>
				<Grid.Col>
					<Select
						label='Status'
						placeholder='Izvēlies vienu'
						required
						data={[
							{value: 'draft', label: 'Melnraksts', group: 'Redaktors'},
							{value: 'approved', label: 'Apstiprināts', group: 'Redaktors'},
							{value: 'active', label: 'Aktīvs'}
						]}
						{...form.getInputProps('status')}
					/>
				</Grid.Col>
			</Grid>
		</Container>
	)
}

const Editor = ({session}) => {
	const router = useRouter()

	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)

	const form = useForm({
		initialValues: {
			title: 'Virsraksts',
			tags: 'mario, party, wuu',
			category: 'news',
			status: 'draft',
			article: 'Some text? Bro?',
			notes: '',
			thumbnail: '',
			mp3: ''
		},
		validate: {
			mp3: val =>
				val === '' || /^https:\/\/cdn\.uoc\.lv\/uoc\.lv-podkasts-\d{1,3}\.mp3$/.test(val)
					? null
					: 'Saite nav pareizā formātā'
		}
	})

	if (session === null) {
		return router.push('/')
	}

	const handleSubmit = values => {
		setError(null)
		setSuccess(null)
		setLoading(true)
		fetch('/api/articles/createnewarticle', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({values})
		})
			.then(res => res.json())
			.then(res => {
				setLoading(false)
				if (typeof res.error !== 'undefined') {
					return setError(res.error)
				}
				setSuccess(true)
			})
			.catch(err => {
				setLoading(false)
				return setError(err.message)
			})
	}

	return (
		<>
			<Head>
				<title>Redaktors</title>
			</Head>
			<AppShellPage session={session} sidebar={<SideBar form={form} />}>
				<Container size='xl'>
					<form action='' method='post' onSubmit={form.onSubmit(handleSubmit)}>
						<Grid>
							<Grid.Col span={12}>
								<TextInput
									id='Virsraksts'
									required
									label='Virsraksts'
									placeholder='Virsraksts'
									{...form.getInputProps('title')}
								/>
							</Grid.Col>
							<Grid.Col span={12}>
								<TextInput
									id='Tagi'
									required
									label='Tagi, atdalīt ar komatu..'
									placeholder='Tagi'
									{...form.getInputProps('tags')}
								/>
							</Grid.Col>
							<Grid.Col span={12}>
								<Select
									label='Kategorija'
									placeholder='Izvēlies vienu'
									required
									data={[
										{value: 'review', label: 'Apskats'},
										{value: 'news', label: 'Ziņas'},
										{value: 'video', label: 'Video'},
										{value: 'blogs', label: 'Blogs'},
										{value: 'podcast', label: 'Podkāsts'}
									]}
									{...form.getInputProps('category')}
								/>
							</Grid.Col>
							<Grid.Col span={12}>
								<ArticleEditor {...form.getInputProps('article')} />
							</Grid.Col>
							<Grid.Col span={12}>
								<ErrorBox error={error} />
							</Grid.Col>
							<Grid.Col span={12}>
								<Button
									leftIcon={success && <Check size={14} />}
									loading={loading}
									type='submit'
									color='green'
								>
									Saglabāt
								</Button>
							</Grid.Col>
						</Grid>
					</form>
				</Container>
			</AppShellPage>
		</>
	)
}

export default Editor
