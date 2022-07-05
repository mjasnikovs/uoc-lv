import {useState} from 'react'

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
	Alert
} from '@mantine/core'
import {useForm} from '@mantine/form'

import AlertCircle from 'tabler-icons-react/dist/icons/alert-circle'

import Link from 'next/link'

import AppShellPage from '../components/shell/AppShellPage'
import ErrorBox from '../components/ErrorBox'

const Register = () => {
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)
	const [newAccount, setNewAccount] = useState(false)

	const form = useForm({
		initialValues: {
			email: '',
			name: '',
			password: '',
			password2: '',
			robo: ''
		},
		validate: {
			email: value => (/^\S+@\S+$/.test(value) ? null : 'E-pasts formāts nav derīgs'),
			name: value => (String(value.length) >= 3 ? null : 'Segvārds ir pārāk īss'),
			password2: (value, values) => {
				if (String(value.length) <= 5) {
					return 'Parole ir pārāk īsa.'
				} else if (value !== values.password) {
					return 'Paroles nesakrīt'
				}
				return null
			}
		}
	})

	const handleSubmit = values => {
		setError(null)
		setLoading(true)
		fetch('/api/users/register', {
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
				setNewAccount(true)
				return form.reset()
			})
			.catch(err => {
				setLoading(false)
				return setError(err.message)
			})
	}

	return (
		<AppShellPage>
			<form action='' method='post' onSubmit={form.onSubmit(handleSubmit)}>
				<Container size='xs'>
					<Grid>
						<Grid.Col span={12}>
							<Title order={2}>Izveidot jaunu kontu</Title>
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
							<TextInput
								id='name'
								required
								label='Segvārds'
								placeholder='Skaistas12'
								{...form.getInputProps('name')}
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
							<PasswordInput
								id='password2'
								placeholder='Parole atkārtoti'
								label='Parole atkārtoti'
								required
								{...form.getInputProps('password2')}
							/>
						</Grid.Col>
						<Grid.Col span={12}>
							<TextInput
								id='robo'
								required
								label='Viens plus viens? Ieraksti ciparu.'
								placeholder='Robots Robītis'
								{...form.getInputProps('robo')}
							/>
						</Grid.Col>

						{newAccount && (
							<Grid.Col span={12}>
								<Alert icon={<AlertCircle size={16} />} title='Apsveicu!' color='cyne'>
									Konts ir reģistrēts. &nbsp;
									<Link href='/login' passHref={true}>
										<Anchor variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
											pievienoties sistēmai
										</Anchor>
									</Link>
								</Alert>
								<Space size='md' />
							</Grid.Col>
						)}

						<Grid.Col span={12}>
							<>
								<ErrorBox error={error} />
								{loading ? (
									<Center>
										<Loader />
									</Center>
								) : (
									<Button type='submit' fullWidth>
										Izveidot jaunu kontu
									</Button>
								)}
							</>
						</Grid.Col>

						<Grid.Col span={12}>
							<Center>
								<Breadcrumbs align='center'>
									<Link href='/resetpassword' passHref={true}>
										<Anchor variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
											Atjaunot paroli
										</Anchor>
									</Link>
									<Link href='/login' passHref={true}>
										<Anchor variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
											Pievienoties sistēmai
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

export default Register
