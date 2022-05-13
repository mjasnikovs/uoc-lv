import {Text, Space, Anchor, Image, Grid, Group, ThemeIcon, Badge, MediaQuery} from '@mantine/core'

import {CalendarStats, User} from 'tabler-icons-react'

const images = [
	'https://cdn.uoc.lv/5feefec668950ed09911cd74b1109c31a8854eddx1065x599.jpg',
	'https://cdn.uoc.lv/e999c843a5af34616ccfd61ddae1b89bac28c403x1065x599.jpg',
	'https://cdn.uoc.lv/8a32cfebee81a91c64b807676423447cc0a267e5x1065x599.jpg',
	'https://cdn.uoc.lv/72f0432bf8640a3e2b5d808d6cfe3e1df7562aa6x1065x599.jpg',
	'https://cdn.uoc.lv/49962a3579800af6817b31bb3b4e4fd035110769x1065x599.jpg',
	'https://cdn.uoc.lv/62a6e006618ee5d3d3cfea189e01b26d5726bc9ax1065x599.jpg'
]

const HOSTNAME = process.env.HOSTNAME

const NewsArticleCard = ({id = 0}) => (
	<>
		<Grid>
			<Grid.Col xs={12} sm={5}>
				<Image radius='xs' src={images[id]} alt='Random unsplash image' />
			</Grid.Col>
			<Grid.Col xs={12} sm={7}>
				<Group>
					<ThemeIcon radius='xl' variant='light' size='sm' color='gray'>
						<CalendarStats />
					</ThemeIcon>
					<Text color='grey'>20.12.20022</Text>
					<ThemeIcon radius='xl' variant='light' size='sm' color='gray'>
						<User />
					</ThemeIcon>
					<Text color='grey'>Fireskelets</Text>
				</Group>
				<Space h='xs' />
				<Text size='xl' weight='bold'>
					Nostaļģija nespēj izglābt Tomb Raider: The Last Revelation
				</Text>
				<Space h='xs' />
				<MediaQuery smallerThan='sm' styles={{display: 'none'}}>
					<Text color='grey'>
						Kad bērnībā spēlēju Tomb Raider The Last Revelation, tā mani aizrāva ar interesantajiem spēles
						līmeņiem ...
					</Text>
				</MediaQuery>
				<Space h='xs' />
				<Anchor href={HOSTNAME}>
					<Badge variant='gradient' radius='sm' gradient={{from: 'indigo', to: 'cyan'}}>
						Lasīt vairāk
					</Badge>
				</Anchor>
			</Grid.Col>
		</Grid>
		<Space h='xl' />
		<Space h='xl' />
	</>
)

export default NewsArticleCard
