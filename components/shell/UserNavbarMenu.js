import {Anchor, Group, ThemeIcon} from '@mantine/core'

import Link from 'next/link'
import {Logout, Login, User} from 'tabler-icons-react'

const UserMenu = ({session}) => {
	if (session) {
		return (
			<Group position='right'>
				<Link href='/profile'>
					<Anchor>
						<Group position='right'>
							Profils
							<ThemeIcon size='lg' variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
								<User />
							</ThemeIcon>
						</Group>
					</Anchor>
				</Link>
				<Link href='/logout'>
					<Anchor>
						<Group position='right'>
							Atvienoties
							<ThemeIcon size='lg' variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
								<Logout />
							</ThemeIcon>
						</Group>
					</Anchor>
				</Link>
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
