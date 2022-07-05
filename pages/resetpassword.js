import {Anchor, PasswordInput, Button, Breadcrumbs, Grid, Center, Container, Title} from '@mantine/core'

import Link from 'next/link'
import AppShellPage from '../components/shell/AppShellPage'

const ResetPassword = () => (
	<AppShellPage>
		<Container size='xs'>
			<Grid>
				<Grid.Col span={12}>
					<Title order={2}>Izveidot jaunu paroli</Title>
				</Grid.Col>
				<Grid.Col span={12}>
					<PasswordInput placeholder='Parole' label='Parole' required />
				</Grid.Col>
				<Grid.Col span={12}>
					<PasswordInput placeholder='Parole atkārtoti' label='Parole atkārtoti' required />
				</Grid.Col>
				<Grid.Col span={12}>
					<Button fullWidth>Izveidot jaunu paroli</Button>
				</Grid.Col>

				<Grid.Col span={12}>
					<Center>
						<Breadcrumbs align='center'>
							<Link href='/register' passHref={true}>
								<Anchor variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
									Izveidot jaunu kontu
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
	</AppShellPage>
)

export default ResetPassword
