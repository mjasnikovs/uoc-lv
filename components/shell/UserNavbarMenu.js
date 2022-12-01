import {Anchor, Group, ThemeIcon, Tooltip} from '@mantine/core'

import Link from 'next/link'

import Logout from 'tabler-icons-react/dist/icons/logout'
import Login from 'tabler-icons-react/dist/icons/login'
import User from 'tabler-icons-react/dist/icons/user'
import List from 'tabler-icons-react/dist/icons/list'

const UserMenu = ({session}) => {
	if (session) {
		return (
			<Group position='right'>
				<Tooltip label='Melnraksti' position='bottom' placement='end' color='indigo' gutter={10}>
					<Link href='/drafts' passHref={true}>
						<Anchor>
							<Group position='right'>
								<ThemeIcon size='lg' variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
									<List />
								</ThemeIcon>
							</Group>
						</Anchor>
					</Link>
				</Tooltip>
				<Tooltip label='Profils' position='bottom' placement='end' color='indigo' gutter={10}>
					<Link href='/profile' passHref={true}>
						<Anchor>
							<Group position='right'>
								<ThemeIcon size='lg' variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
									<User />
								</ThemeIcon>
							</Group>
						</Anchor>
					</Link>
				</Tooltip>
				<Tooltip label='Atvienoties' position='bottom' placement='end' color='indigo' gutter={10}>
					<Link href='/logout' passHref={true}>
						<Anchor>
							<Group position='right'>
								<ThemeIcon size='lg' variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
									<Logout />
								</ThemeIcon>
							</Group>
						</Anchor>
					</Link>
				</Tooltip>
			</Group>
		)
	}

	return (
		<Link href='/login' passHref={true}>
			<Anchor>
				<Group position='right'>
					Pieslēgties
					<ThemeIcon size='lg' variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
						<Login />
					</ThemeIcon>
				</Group>
			</Anchor>
		</Link>
	)
}

export default UserMenu
