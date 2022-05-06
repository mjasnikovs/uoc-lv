import {AppShell, Header, Container, Anchor, Breadcrumbs, Grid, Input} from '@mantine/core'

import Link from 'next/link'

import {Search} from 'tabler-icons-react'
import FooterPage from './FooterPage'
import SideBar from './SideBar'

const URL = process.env.URL

console.log(URL)

const AppShellPage = ({children}) => (
	<AppShell
		header={
			<Header minheight={60} p='md'>
				<Container size='xl'>
					<Grid>
						<Grid.Col xs={12} sm={8}>
							<Breadcrumbs separator=' '>
								<Link href={URL} passHref>
									<Anchor
										style={{
											textDecoration: 'none'
										}}
										color='yellow'
										weight='800'
										size='xl'
									>
										UOC.LV
									</Anchor>
								</Link>
								<Link href={`${URL}editor`} passHref>
									<Anchor size='xl' variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
										redaktors
									</Anchor>
								</Link>
								<Link href={`${URL}reader`} passHref>
									<Anchor size='xl' variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
										skatītājs
									</Anchor>
								</Link>
							</Breadcrumbs>
						</Grid.Col>
						<Grid.Col xs={12} sm={4}>
							<Input icon={<Search />} placeholder='Meklēt' />
						</Grid.Col>
					</Grid>
				</Container>
			</Header>
		}
		footer={<FooterPage />}
	>
		<Container size='xl'>
			<Grid>
				<Grid.Col xs={12} md={8}>
					{children}
				</Grid.Col>
				<Grid.Col xs={12} md={4}>
					<SideBar />
				</Grid.Col>
			</Grid>
		</Container>
	</AppShell>
)

export default AppShellPage
