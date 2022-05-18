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
	Loader
} from '@mantine/core'

import {useForm} from '@mantine/form'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {useState} from 'react'
import AppShellPage from '../components/AppShellPage'
import ErrorBox from '../components/ErrorBox'

const HOSTNAME = process.env.NEXT_PUBLIC_HOSTNAME

const CreateNewSession = ({id, token}) => {
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)
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
		fetch('/api/users/createnewsession', {
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
				return router.push('/')
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
									<Link href={`${HOSTNAME}createnewpassword`} passHref>
										<Anchor variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
											Atjaunot paroli
										</Anchor>
									</Link>
									<Link href={`${HOSTNAME}createnewaccount`} passHref>
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

export default CreateNewSession
