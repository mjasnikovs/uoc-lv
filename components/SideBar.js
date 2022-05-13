import {Space, Input} from '@mantine/core'

import {Search} from 'tabler-icons-react'

import ComentsTab from './ComentsTab'
import DiscordTab from './DiscordTab'

const SideBar = () => (
	<>
		<Input icon={<Search />} placeholder='Meklēt' />
		<Space h='xl' />
		<ComentsTab />
		<Space h='xl' />
		<DiscordTab />
	</>
)

export default SideBar
