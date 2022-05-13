import pg from '../connections/pg'
import {
	Anchor,
	Input,
	InputWrapper,
	PasswordInput,
	Button,
	Breadcrumbs,
	Grid,
	Center,
	Container,
	Title
} from '@mantine/core'

import Link from 'next/link'
import AppShellPage from '../components/AppShellPage'

const HOSTNAME = process.env.NEXT_PUBLIC_HOSTNAME

export const getServerSideProps = async () => {
	const result = await pg({
		query: 'select message::text as value from test order by id limit 1',
		object: true
	})

	return {
		props: {value: result?.value || ''}
	}
}

const CreateNewSession = () => (
	<AppShellPage>
		<Container size='xs'>
			<Grid>
				<Grid.Col span={12}>
					<Title order={2}>Konta pārvalde</Title>
				</Grid.Col>
				<Grid.Col span={12}>
					<InputWrapper label='E-pasts' required>
						<Input />
					</InputWrapper>
				</Grid.Col>
				<Grid.Col span={12}>
					<PasswordInput placeholder='Parole' label='Parole' required />
				</Grid.Col>
				<Grid.Col span={12}>
					<Button fullWidth>Pievienoties sitēmai</Button>
				</Grid.Col>

				<Grid.Col span={12}>
					<Center>
						<Breadcrumbs grow align='center'>
							<Link href={`${HOSTNAME}createnewaccount`} passHref>
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
	</AppShellPage>
)

export default CreateNewSession
