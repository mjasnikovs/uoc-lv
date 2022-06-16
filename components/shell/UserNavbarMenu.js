import {Anchor, Group, ThemeIcon, Tooltip} from '@mantine/core'

import Link from 'next/link'
import {Logout, Login, User, List} from 'tabler-icons-react'

const UserMenu = ({session}) => {
	if (session) {
		return (
			<Group position='right'>
				<Tooltip label='Melnraksti' position='bottom' placement='end' color='indigo' gutter={10}>
					<Link href='/drafts'>
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
					<Link href='/profile'>
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
					<Link href='/logout'>
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
		<Link href='/login'>
			<Anchor>
				<Group position='right'>
					Pievienoties
					<ThemeIcon size='lg' variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
						<Login />
					</ThemeIcon>
				</Group>
			</Anchor>
		</Link>
	)
}

export default UserMenu