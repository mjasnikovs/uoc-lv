import {
	Anchor,
	PasswordInput,
	Button,
	Breadcrumbs,
	Grid,
	Center,
	Container,
	Title,
	TextInput,
	Loader,
	Space,
	Alert,
	Avatar,
	InputWrapper
} from '@mantine/core'

import {Dropzone, MIME_TYPES} from '@mantine/dropzone'

import {AlertCircle} from 'tabler-icons-react'

import {useForm} from '@mantine/form'
import Link from 'next/link'
import {useState} from 'react'
import AppShellPage from '../components/AppShellPage'
import ErrorBox from '../components/ErrorBox'
import DropBox from '../components/DropBox'

import {useRouter} from 'next/router'
import Image from 'next/image'
import {withIronSessionSsr} from 'iron-session/next'
import ironSessionConfig from '../connections/ironSessionConfig'
import pg from '../connections/pg'

const HOSTNAME = process.env.NEXT_PUBLIC_HOSTNAME

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
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)
	const [avatarUrl, setAvatarUrl] = useState(`/avatars/${session.photo}`)

	const form = useForm({
		initialValues: {
			email: session?.email,
			name: session?.name,
			privileges: session?.privileges
		}
	})

	if (session === null) {
		return router.push('/')
	}

	const handleProfilePictureSubmit = files => {
		setError(null)
		setLoading(true)

		const formData = new FormData()
		formData.append('file', files[0])

		fetch('/api/users/uploadprofilepicture', {
			method: 'POST',
			body: formData
		})
			.then(res => res.json())
			.then(res => {
				setLoading(false)
				if (typeof res.error !== 'undefined') {
					return setError(res.error)
				}
				setAvatarUrl(res.url)
				return form.reset()
			})
			.catch(err => {
				setLoading(false)
				return setError(err.message)
			})
	}

	return (
		<AppShellPage session={session}>
			<form action='' method='post'>
				<Container size='xs'>
					<Grid>
						<Grid.Col span={12}>
							<Title order={2}>Profils</Title>
						</Grid.Col>
						<Grid.Col span={12}>
							<TextInput
								id='email'
								disabled
								label='E-pasts'
								placeholder='tavs@epasts.lv'
								{...form.getInputProps('email')}
							/>
						</Grid.Col>
						<Grid.Col span={12}>
							<TextInput
								id='name'
								disabled
								label='Segvārds'
								placeholder='Skaistas12'
								{...form.getInputProps('name')}
							/>
						</Grid.Col>
						<Grid.Col span={12}>
							<TextInput
								id='privileges'
								disabled
								label='Privilēģijas'
								placeholder=''
								{...form.getInputProps('privileges')}
							/>
						</Grid.Col>
						<Grid.Col span={12}>
							<InputWrapper label='Profila bilde' />
							<Center>
								<Avatar size='xl' src={avatarUrl} />
							</Center>
						</Grid.Col>
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
					</Grid>
				</Container>
			</form>
		</AppShellPage>
	)
}

export default CreateNewAccount
