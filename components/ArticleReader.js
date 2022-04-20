import RichTextEditor from '../components/RichTextEditor'
import {Title, Avatar, Grid, Group, ThemeIcon, Text, Badge} from '@mantine/core'
import {CalendarStats, BrandTwitter, BrandFacebook, Link} from 'tabler-icons-react'

const ArticleReader = ({value}) => (
	<Grid>
		<Grid.Col span={8}>
			<Title order={1}>This is h1 title</Title>
		</Grid.Col>
		<Grid.Col span={4}>
			<Group position='right'>
				<ThemeIcon color='blue' variant='light'>
					<BrandTwitter />
				</ThemeIcon>

				<ThemeIcon color='indigo' variant='light'>
					<BrandFacebook />
				</ThemeIcon>

				<ThemeIcon color='indigo' variant='light'>
					<Link />
				</ThemeIcon>
			</Group>
		</Grid.Col>
		<Grid.Col span={12}>
			<RichTextEditor readOnly value={value} />
		</Grid.Col>
		<Grid.Col span={12}>
			<>
				<Badge component='a' href='https://mantine.dev' variant='outline'>
					Tag
				</Badge>
				<Badge component='a' href='https://mantine.dev' variant='outline'>
					Bug
				</Badge>
				<Badge component='a' href='https://mantine.dev' variant='outline'>
					Games
				</Badge>
				<Badge component='a' href='https://mantine.dev' variant='outline'>
					video
				</Badge>
			</>
		</Grid.Col>
		<Grid.Col span={12}>
			<Group>
				<Avatar
					radius='xl'
					src='https://static-cdn.jtvnw.net/jtv_user_pictures/d29eaaac-e5d2-4c14-b2d9-32a96cd0206f-profile_image-70x70.png'
					alt="it's me"
				/>
				<Text color='grey'>Fireskelets</Text>
				<ThemeIcon radius='xl' variant='light' size='sm' color='gray'>
					<CalendarStats />
				</ThemeIcon>
				<Text color='grey'>20.12.20022</Text>
			</Group>
		</Grid.Col>
	</Grid>
)

export default ArticleReader
