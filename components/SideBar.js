import {Space} from '@mantine/core'

import ComentsTab from './ComentsTab'
import DiscordTab from './DiscordTab'

const SideBar = () => (
	<>
		<ComentsTab />
		<Space h='xl' />
		<DiscordTab />
	</>
)

export default SideBar
