import {Anchor, Group, ThemeIcon} from '@mantine/core'

import Link from 'next/link'
import {Logout, Login, User} from 'tabler-icons-react'

const HOSTNAME = process.env.NEXT_PUBLIC_HOSTNAME

const UserMenu = ({session}) => {
	if (session) {
		return (
			<Group position='right'>
				<Link href={`${HOSTNAME}profile`} passHref>
					<Anchor>
						<Group position='right'>
							Profils
							<ThemeIcon size='lg' variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
								<User />
							</ThemeIcon>
						</Group>
					</Anchor>
				</Link>
				<Link href={`${HOSTNAME}deletesession`} passHref>
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
		<Link href={`${HOSTNAME}createnewsession`} passHref>
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
