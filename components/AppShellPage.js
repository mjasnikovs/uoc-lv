import {useState} from 'react'

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
	Space
} from '@mantine/core'

import Link from 'next/link'

import Footer from './Footer'
import UserNavbarMenu from './UserNavbarMenu'

const AppShellContainer = ({children, sidebar, session}) => {
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
					}}
				>
					<Navbar.Section></Navbar.Section>
					<Navbar.Section p='md' hidden={!opened}>
						<Group direction='column' p='md'>
							<Link href='/editor'>
								<Anchor size='xl' variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
									redaktors
								</Anchor>
							</Link>

							<Link href='/reader'>
								<Anchor size='xl' variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
									skatītājs
								</Anchor>
							</Link>
						</Group>
					</Navbar.Section>
					<Navbar.Section>
						<UserNavbarMenu session={session} />
						<Space h='xl' />
					</Navbar.Section>
				</Navbar>
			}
			footer={<Footer />}
			header={
				<Header height={60} p='md'>
					<MediaQuery largerThan='sm' styles={{display: 'none'}}>
						<Group>
							<Burger opened={opened} onClick={() => setOpened(o => !o)} size='sm' mr='xl' />
							<Link href='/'>
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
						</Group>
					</MediaQuery>

					<MediaQuery smallerThan='sm' styles={{display: 'none'}}>
						<Container size='xl'>
							<Grid>
								<Grid.Col xs={12} sm={8}>
									<Breadcrumbs separator=' '>
										<Link href='/'>
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
										<Link href='/editor'>
											<Anchor
												size='xl'
												variant='gradient'
												gradient={{from: 'indigo', to: 'cyan'}}
											>
												redaktors
											</Anchor>
										</Link>
										<Link href='/reader'>
											<Anchor
												size='xl'
												variant='gradient'
												gradient={{from: 'indigo', to: 'cyan'}}
											>
												skatītājs
											</Anchor>
										</Link>
									</Breadcrumbs>
								</Grid.Col>

								<Grid.Col xs={12} sm={4} align='right'>
									<UserNavbarMenu session={session} />
								</Grid.Col>
							</Grid>
						</Container>
					</MediaQuery>
				</Header>
			}
		>
			<Container size='xl' hidden={opened}>
				<Grid>
					<Grid.Col xs={12} md={8}>
						{children}
					</Grid.Col>
					<Grid.Col xs={12} md={4}>
						{sidebar}
					</Grid.Col>
				</Grid>
			</Container>
		</AppShell>
	)
}

export default AppShellContainer
