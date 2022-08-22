import {useState} from 'react'

import {withIronSessionSsr} from 'iron-session/next'

import {ironSessionSettings, getSession} from '../../connections/ironSession'
import pg from '../../connections/pg'

import {
	Grid,
	Container,
	TextInput,
	Select,
	Button,
	Center,
	Textarea,
	Anchor,
	ActionIcon,
	Group,
	Alert,
	Modal,
	Space,
	Image as ImageContainer
} from '@mantine/core'
import {useForm} from '@mantine/form'
import {Dropzone, MIME_TYPES} from '@mantine/dropzone'

import Check from 'tabler-icons-react/dist/icons/check'
import IconLink from 'tabler-icons-react/dist/icons/link'
import AlertCircle from 'tabler-icons-react/dist/icons/alert-circle'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'

import {format, integerFormat} from 'format-schema'

import AppShellPage from '../../components/shell/AppShellPage'
import ArticleEditor from '../../components/articles/ArticleEditor'
import ErrorBox from '../../components/ErrorBox'
import DropBox from '../../components/DropBox'

const test = format({
	articleId: integerFormat({naturalNumber: true, notEmpty: true})
})

const statusOptions = [
	{key: 'draft', value: 'draft', label: 'Melnraksts'},
	{key: 'approved', value: 'approved', label: 'Iesniegt apstiprināšanai'}
]

const statusOptionsAdministrator = [
	{key: 'draft', value: 'draft', label: 'Melnraksts'},
	{key: 'approved', value: 'approved', label: 'Apstiprināts'},
	{key: 'active', value: 'active', label: 'Aktīvs'}
]

export const getServerSideProps = withIronSessionSsr(async ({req, res, params}) => {
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

	const articleId = params.id
	const data = test({articleId})

	if (data instanceof Error) {
		res.statusCode = 302
		res.setHeader('location', '/editor/0')
		res.end()
		return {
			props: {
				session
			}
		}
	}

	if (data.articleId === 0) {
		return {
			props: {
				session,
				article: null
			}
		}
	}

	const article = await pg({
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
	})

	if (session.privileges !== 'administrator' && session.id !== article?.userId) {
		res.statusCode = 403
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
			session,
			article
		}
	}
}, ironSessionSettings)

const SideBar = ({form, article, session}) => {
	const router = useRouter()
	const [error, setError] = useState(null)
	const [loadingThumbnail, setLoadingThumbnail] = useState(null)
	const [thumbnail, setThumbnail] = useState(null)
	const [deleteId, setDeleteId] = useState(null)

	const [deleteError, setDeleteError] = useState(null)
	const [deleteLoading, setDeleteLoading] = useState(null)

	const handlePictureSubmit = files => {
		setError(null)
		setLoadingThumbnail(true)

		const formData = new FormData()
		formData.append('file', files[0])
		formData.append('type', 'thumbnail')
		formData.append(
			'oldThumbnailUrl',
			thumbnail || (article && `${process.env.NEXT_PUBLIC_CDN}${article.thumbnail}`)
		)

		fetch('/api/uploadpicture', {
			method: 'POST',
			body: formData
		})
			.then(res => res.json())
			.then(res => {
				setLoadingThumbnail(false)
				if (typeof res.error !== 'undefined') {
					return setError(res.error)
				}
				form.setFieldValue('thumbnail', res.url)
				form.setFieldValue('thumbnailBlur', res.thumbnailBlur)
				return setThumbnail(`${process.env.NEXT_PUBLIC_CDN}${res.url}`)
			})
			.catch(err => {
				setLoadingThumbnail(false)
				return setError(err.message)
			})
	}

	const handleArticleDelete = () => {
		setDeleteLoading(true)
		fetch('/api/articles/deletearticle', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({id: article?.id})
		})
			.then(res => res.json())
			.then(res => {
				setDeleteLoading(false)
				if (typeof res.error !== 'undefined') {
					return setDeleteError(res.error)
				}
				return router.push('/drafts')
			})
			.catch(err => {
				setDeleteLoading(false)
				return setDeleteError(err.message)
			})
	}

	return (
		<Container>
			<>
				<Modal opened={deleteId} onClose={() => setDeleteId(null)} title='Apstiprināt dzēšanu.'>
					<Alert icon={<AlertCircle size={16} />} title='Brīdinājums' color='red'>
						Raksts tik neatgriezeniski dzēst. Apstiprināt?
					</Alert>
					<Space h='xl' />
					<ErrorBox error={deleteError} />
					<Button
						loading={deleteLoading}
						disabled={deleteLoading}
						variant='gradient'
						radius='sm'
						fullWidth
						uppercase
						gradient={{from: 'red', to: 'pink'}}
						onClick={handleArticleDelete}
					>
						Dzēst
					</Button>
				</Modal>
			</>
			<Grid>
				<Grid.Col span={12}>
					<label>Titilbilde</label>
				</Grid.Col>
				{(thumbnail || article?.thumbnail) && (
					<>
						<Grid.Col span={12}>
							<Center>
								<Image
									as={ImageContainer}
									src={thumbnail || `${process.env.NEXT_PUBLIC_CDN}${article.thumbnail}`}
									alt='titulbilde'
									width='384'
									height='216'
								/>
							</Center>
						</Grid.Col>
						<Grid.Col>
							<TextInput id='thumbnailBlur' {...form.getInputProps('thumbnailBlur')} disabled />
						</Grid.Col>
					</>
				)}
				<Grid.Col span={12}>
					<ErrorBox error={error} />
					<Dropzone
						loading={loadingThumbnail}
						multiple={false}
						onDrop={handlePictureSubmit}
						onReject={() => setError('Faila/u augšuplāde neizdevās.')}
						maxSize={3 * 1024 ** 2}
						accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
					>
						{status => DropBox(status)}
					</Dropzone>
				</Grid.Col>
				{form.getInputProps('category').value === 'podcast' && (
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
						data={session.privileges === 'administrator' ? statusOptionsAdministrator : statusOptions}
						{...form.getInputProps('status')}
					/>
				</Grid.Col>
				{article?.url && (
					<>
						<Grid.Col>
							<Link href={`/article/${article.url}`} passHref={true}>
								<Anchor>
									<Group>
										<ActionIcon>
											<IconLink />
										</ActionIcon>
										{process.env.NEXT_PUBLIC_HOSTNAME}article/{article.url}
									</Group>
								</Anchor>
							</Link>
						</Grid.Col>

						<Grid.Col>
							<Button
								variant='gradient'
								compact
								radius='sm'
								size='xs'
								uppercase
								gradient={{from: 'red', to: 'pink'}}
								onClick={() => setDeleteId(article.id)}
							>
								Dzēst
							</Button>
						</Grid.Col>
					</>
				)}
			</Grid>
		</Container>
	)
}

const Editor = ({session, article}) => {
	const router = useRouter()

	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)

	const form = useForm({
		initialValues: {
			title: article?.title || 'Virsraksts',
			tags: article ? String(article.tags) : 'mario, party, wuu',
			category: article?.category || 'news',
			status: article?.status || 'draft',
			article: article?.article || 'Some text? Bro?',
			notes: article?.notes || '',
			thumbnail: article?.thumbnail || undefined,
			thumbnailBlur: article?.thumbnailBlur || undefined,
			mp3: article?.mp3 || ''
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

		const url = (() => {
			if (article?.id) {
				return '/api/articles/updatearticle'
			}
			return '/api/articles/createarticle'
		})()

		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({...values, id: article?.id})
		})
			.then(res => res.json())
			.then(res => {
				setLoading(false)
				if (typeof res.error !== 'undefined') {
					return setError(res.error)
				}
				setSuccess(true)
				if (!article) return router.push(`/editor/${res.id}`)
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
			<AppShellPage
				session={session}
				sidebar={
					<SideBar form={form} article={article} loading={loading} success={success} session={session} />
				}
			>
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
										{value: 'blog', label: 'Blogs'},
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
									{article ? 'Saglabāt' : 'Pievienot'}
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
