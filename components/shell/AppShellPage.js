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
	Space,
	Input,
	Button
} from '@mantine/core'

import Link from 'next/link'
import {useRouter} from 'next/router'

import Search from 'tabler-icons-react/dist/icons/search'

import Footer from './Footer'
import UserNavbarMenu from './UserNavbarMenu'
import SideBar from '../sidebar/SideBar'

const AppShellContainer = ({children, sidebar, session}) => {
	const [opened, setOpened] = useState(false)

	const router = useRouter()
	const [search, setSearch] = useState('')

	const handleSubmit = e => {
		e.preventDefault()
		router.push('/search/' + search)
		setOpened(false)
	}

	return (
		<AppShell
			fixed={false}
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
						<Group direction='column' p='md' grow>
							<form action='' method='post' onSubmit={handleSubmit}>
								<Input
									icon={<Search />}
									placeholder='Meklēt'
									value={search}
									onChange={e => setSearch(e.target.value)}
									rightSection={
										<Button disabled={search === ''} type='submit'>
											<Search />
										</Button>
									}
								/>
							</form>
						</Group>
					</Navbar.Section>
					<Navbar.Section p='md' hidden={!opened}>
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
							<Link href='/' passHref={true}>
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
										<Link href='/' passHref={true}>
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
						{sidebar || <SideBar />}
					</Grid.Col>
				</Grid>
			</Container>
		</AppShell>
	)
}

export default AppShellContainer
