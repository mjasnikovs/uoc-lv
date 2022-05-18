import {Anchor, Group, ThemeIcon} from '@mantine/core'

import Link from 'next/link'
import {Logout, Login} from 'tabler-icons-react'

const HOSTNAME = process.env.NEXT_PUBLIC_HOSTNAME

const UserMenu = ({session}) => {
	if (session) {
		return (
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
