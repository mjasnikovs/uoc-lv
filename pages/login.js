import {useState} from 'react'
import {useRouter} from 'next/router'

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
	Alert
} from '@mantine/core'
import {useForm} from '@mantine/form'

import AlertCircle from 'tabler-icons-react/dist/icons/alert-circle'

import Link from 'next/link'

import AppShellPage from '../components/shell/AppShellPage'
import ErrorBox from '../components/ErrorBox'

const Login = ({id, token}) => {
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)

	const router = useRouter()

	const form = useForm({
		initialValues: {
			email: '',
			password: ''
		},
		validate: {
			email: value => (/^\S+@\S+$/.test(value) ? null : 'E-pasts formāts nav derīgs')
		}
	})

	const handleSubmit = values => {
		setError(null)
		setLoading(true)
		fetch('/api/users/login', {
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
				form.reset()
				setSuccess(true)
				return router.push('/')
			})
			.catch(err => {
				setLoading(false)
				return setError(err.message)
			})
	}

	if (success === true) {
		return (
			<AppShellPage>
				<Alert icon={<AlertCircle size={16} />} title='Tev paveicās!' color='teal'>
					Tu tiksi pāradresēts uz sākumlapu. Ja tas nenotiek automātiski, spied te:
					<Link href='/'>
						<Anchor variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
							{' '}
							sākums
						</Anchor>
					</Link>
				</Alert>
			</AppShellPage>
		)
	}

	return (
		<AppShellPage>
			<form action='' method='post' onSubmit={form.onSubmit(handleSubmit)}>
				<Container size='xs'>
					<Grid>
						<Grid.Col span={12}>
							<Title order={2}>
								Pievienoties sistēmai {id} {token}
							</Title>
						</Grid.Col>

						<Grid.Col span={12}>
							<TextInput
								id='email'
								required
								label='E-pasts'
								placeholder='tavs@epasts.lv'
								{...form.getInputProps('email')}
							/>
						</Grid.Col>

						<Grid.Col span={12}>
							<PasswordInput
								idf='password'
								placeholder='Parole'
								label='Parole'
								required
								{...form.getInputProps('password')}
							/>
						</Grid.Col>

						<Grid.Col span={12}>
							<>
								<ErrorBox error={error} />
								{loading ? (
									<Center>
										<Loader />
									</Center>
								) : (
									<Button type='submit' fullWidth>
										Pievienoties
									</Button>
								)}
							</>
						</Grid.Col>

						<Grid.Col span={12}>
							<Center>
								<Breadcrumbs align='center'>
									<Link href='/resetpassword'>
										<Anchor inherit variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
											Atjaunot paroli
										</Anchor>
									</Link>
									<Link href='/register'>
										<Anchor variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
											Izveidot jaunu kontu
										</Anchor>
									</Link>
								</Breadcrumbs>
							</Center>
						</Grid.Col>
					</Grid>
				</Container>
			</form>
		</AppShellPage>
	)
}

export default Login
