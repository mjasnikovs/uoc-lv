import React from 'react'
import {Anchor, Group, ThemeIcon} from '@mantine/core'

import Link from 'next/link'
import {Login} from 'tabler-icons-react'
const HOSTNAME = process.env.NEXT_PUBLIC_HOSTNAME

const UserMenu = () => (
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

export default UserMenu
