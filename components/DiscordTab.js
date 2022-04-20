import {Space, Badge} from '@mantine/core'

const DiscordTab = () => (
	<>
		<Badge variant='gradient' radius='sm' gradient={{from: 'indigo', to: 'cyan'}} fullWidth>
			Discord
		</Badge>
		<Space h='xl' />
		<div
			style={{
				border: 'none',
				borderRadius: '5px',
				overflow: 'hidden',
				position: 'relative',
				height: '400px'
			}}>
			<iframe
				src='https://discord.com/widget?id=619838999208656906&theme=dark'
				width='100%'
				height='400'
				allowtransparency='true'
				frameBorder='0'
				sandbox='allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts'></iframe>
		</div>
	</>
)

export default DiscordTab
