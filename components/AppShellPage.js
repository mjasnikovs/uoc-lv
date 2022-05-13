import React, {useState} from 'react'
import {
	AppShell,
	Navbar,
	Header,
	MediaQuery,
	Burger,
	Container,
	Grid,
	Anchor,
	Group,
	Breadcrumbs,
	Input
} from '@mantine/core'

import {Search} from 'tabler-icons-react'

import Link from 'next/link'
import Footer from './Footer'
import SideBar from './SideBar'

const HOSTNAME = process.env.HOSTNAME

const AppShellContainer = ({children}) => {
	const [opened, setOpened] = useState(false)
	return (
		<AppShell
			navbarOffsetBreakpoint='sm'
			asideOffsetBreakpoint='sm'
			navbar={
				<Navbar
					hiddenBreakpoint='lg'
					hidden={!opened}
					width={{sm: 200, lg: 0}}
					styles={{
						root: {border: 'none'}
					}}>
					<Navbar.Section></Navbar.Section>
					<Navbar.Section p='md' hidden={!opened}>
						<Group direction='column' p='md'>
							<Link href={`${HOSTNAME}editor`} passHref>
								<Anchor size='xl' variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
									redaktors
								</Anchor>
							</Link>

							<Link href={`${HOSTNAME}reader`} passHref>
								<Anchor size='xl' variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
									skatītājs
								</Anchor>
							</Link>
						</Group>
					</Navbar.Section>
				</Navbar>
			}
			footer={<Footer />}
			header={
				<Header height={60} p='md'>
					<MediaQuery largerThan='sm' styles={{display: 'none'}}>
						<Group>
							<Burger opened={opened} onClick={() => setOpened(o => !o)} size='sm' mr='xl' />
							<Link href={HOSTNAME} passHref>
								<Anchor
									style={{
										textDecoration: 'none'
									}}
									color='yellow'
									weight='800'
									size='xl'>
									UOC.LV
								</Anchor>
							</Link>
						</Group>
					</MediaQuery>

					<MediaQuery smallerThan='sm' styles={{display: 'none'}}>
						<Container size='xl'>
							<Grid>
								<Grid.Col xs={12} sm={8}>
									<Breadcrumbs separator=' '>
										<Link href={HOSTNAME} passHref>
											<Anchor
												style={{
													textDecoration: 'none'
												}}
												color='yellow'
												weight='800'
												size='xl'>
												UOC.LV
											</Anchor>
										</Link>
										<Link href={`${HOSTNAME}editor`} passHref>
											<Anchor
												size='xl'
												variant='gradient'
												gradient={{from: 'indigo', to: 'cyan'}}>
												redaktors
											</Anchor>
										</Link>
										<Link href={`${HOSTNAME}reader`} passHref>
											<Anchor
												size='xl'
												variant='gradient'
												gradient={{from: 'indigo', to: 'cyan'}}>
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
					</MediaQuery>
				</Header>
			}>
			<Container size='xl' hidden={opened}>
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
}

export default AppShellContainer
