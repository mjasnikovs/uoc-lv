import {Text, Space, Grid, Badge, List, Avatar} from '@mantine/core'

const ComentBadgeStyle = {float: 'right', position: 'absolute', right: 0}

const ComentsTab = () => (
	<>
		<Badge variant='gradient' radius='sm' gradient={{from: 'indigo', to: 'cyan'}} fullWidth>
			komentāri
		</Badge>
		<Space h='xl' />
		<List
			style={{position: 'relative'}}
			spacing='lg'
			icon={
				<Avatar color='indigo' radius='xl'>
					MK
				</Avatar>
			}>
			<List.Item>
				<Grid gutter='xs'>
					<Grid.Col span={10}>
						<Text color='gray'>Nostaļģija nespēj izglābt Tomb Raider: The Last Revelation</Text>
					</Grid.Col>
					<Grid.Col span={2}>
						<Badge size='lg' variant='outline' style={ComentBadgeStyle}>
							1
						</Badge>
					</Grid.Col>
				</Grid>
			</List.Item>
			<List.Item>
				<Grid gutter='xs'>
					<Grid.Col span={10}>
						<Text color='gray'>Clone or download repository from GitHub</Text>
					</Grid.Col>
					<Grid.Col span={2}>
						<Badge size='lg' variant='outline' style={ComentBadgeStyle}>
							1
						</Badge>
					</Grid.Col>
				</Grid>
			</List.Item>
			<List.Item>
				<Grid gutter='xs'>
					<Grid.Col span={10}>
						<Text color='gray'>Clone or download repository from GitHub</Text>
					</Grid.Col>
					<Grid.Col span={2}>
						<Badge size='lg' variant='outline' style={ComentBadgeStyle}>
							1
						</Badge>
					</Grid.Col>
				</Grid>
			</List.Item>
			<List.Item>
				<Grid gutter='xs'>
					<Grid.Col span={10}>
						<Text color='gray'>Clone or download repository from GitHub</Text>
					</Grid.Col>
					<Grid.Col span={2}>
						<Badge size='lg' variant='outline' style={ComentBadgeStyle}>
							1
						</Badge>
					</Grid.Col>
				</Grid>
			</List.Item>
			<List.Item
				icon={
					<Avatar
						color='indigo'
						radius='xl'
						src='https://static-cdn.jtvnw.net/jtv_user_pictures/d29eaaac-e5d2-4c14-b2d9-32a96cd0206f-profile_image-70x70.png'
						alt="it's me"
					/>
				}>
				<Grid gutter='xs'>
					<Grid.Col span={10}>Clone or download repository from GitHub</Grid.Col>
					<Grid.Col span={2}>
						<Badge size='lg' variant='outline' style={ComentBadgeStyle}>
							1
						</Badge>
					</Grid.Col>
				</Grid>
			</List.Item>
			<List.Item>
				<Grid gutter='xs'>
					<Grid.Col span={10}>
						<Text color='gray'>Clone or download repository from GitHub</Text>
					</Grid.Col>
					<Grid.Col span={2}>
						<Badge size='lg' variant='outline' style={ComentBadgeStyle}>
							1
						</Badge>
					</Grid.Col>
				</Grid>
			</List.Item>
			<List.Item>
				<Grid gutter='xs'>
					<Grid.Col span={10}>
						<Text color='gray'>Clone or download repository from GitHub</Text>
					</Grid.Col>
					<Grid.Col span={2}>
						<Badge size='lg' variant='outline' style={ComentBadgeStyle}>
							1
						</Badge>
					</Grid.Col>
				</Grid>
			</List.Item>
		</List>
	</>
)

export default ComentsTab
