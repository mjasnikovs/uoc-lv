import {AppShell, Header, Container, Anchor, Breadcrumbs, Grid, Input} from '@mantine/core'

import {Search} from 'tabler-icons-react'
import FooterPage from './FooterPage'
import SideBar from './SideBar'

const AppShellPage = ({children}) => (
	<AppShell
		header={
			<Header height={60} p='md'>
				<Container size='xl'>
					<Grid>
						<Grid.Col span={8}>
							<Breadcrumbs separator=' ' style={{marginTop: 5}}>
								<Anchor
									style={{
										textDecoration: 'none'
									}}
									color='yellow'
									weight='800'
									size='xl'
									href='https://mantine.dev/'>
									UOC.LV
								</Anchor>
								<Anchor
									size='xl'
									variant='gradient'
									gradient={{from: 'indigo', to: 'cyan'}}
									href='https://mantine.dev/'>
									podkāsts
								</Anchor>
								<Anchor
									size='xl'
									variant='gradient'
									gradient={{from: 'indigo', to: 'cyan'}}
									href='https://mantine.dev/'>
									arhīvs
								</Anchor>
							</Breadcrumbs>
						</Grid.Col>
						<Grid.Col span={4}>
							<Input icon={<Search />} placeholder='Meklēt' />
						</Grid.Col>
					</Grid>
				</Container>
			</Header>
		}
		footer={<FooterPage />}>
		<Container size='xl'>
			<Grid>
				<Grid.Col span={8}>{children}</Grid.Col>
				<Grid.Col span={4}>
					<SideBar />
				</Grid.Col>
			</Grid>
		</Container>
	</AppShell>
)

export default AppShellPage
