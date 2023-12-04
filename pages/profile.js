import {useState} from 'react'

import {Grid, Center, Container, Title, TextInput, Avatar, Input} from '@mantine/core'
import {Dropzone, MIME_TYPES} from '@mantine/dropzone'
import {useForm} from '@mantine/form'

import {useRouter} from 'next/router'
import Image from 'next/image'

import AppShellPage from '../components/shell/AppShellPage'
import ErrorBox from '../components/ErrorBox'
import DropBox from '../components/DropBox'

export {getServerSideProps} from '../connections/ironSession'

const Profile = ({session}) => {
	const router = useRouter()
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)
	const [avatarUrl, setAvatarUrl] = useState(session.photo && `${process.env.NEXT_PUBLIC_CDN}${session.photo}`)

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
				setAvatarUrl(`${process.env.NEXT_PUBLIC_CDN}${res.url}`)
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
								placeholder='E-pasts'
								{...form.getInputProps('email')}
							/>
						</Grid.Col>
						<Grid.Col span={12}>
							<TextInput
								id='name'
								disabled
								label='Segvārds'
								placeholder='Segvārds'
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
							<Input.Wrapper label='Profila attēls' />
							{avatarUrl && (
								<Center>
									<Avatar size='xl'>
										<Image
											src={avatarUrl}
											alt={form.getInputProps('name')}
											width='150'
											height='150'
										/>
									</Avatar>
								</Center>
							)}
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
								<DropBox />
							</Dropzone>
						</Grid.Col>
					</Grid>
				</Container>
			</form>
		</AppShellPage>
	)
}

export default Profile
