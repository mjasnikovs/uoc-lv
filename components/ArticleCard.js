import {Text, Space, Anchor, Grid, Group, ThemeIcon, Badge, MediaQuery} from '@mantine/core'
import Image from 'next/image'
import {CalendarStats, User} from 'tabler-icons-react'
import {toLocaleDateFull, strip} from '../connections/locales'
import Link from 'next/link'

const NewsArticleCard = ({id, userName, thumbnail, publishedAt, title, url, article, createdAt, editLink}) => (
	<>
		<Grid>
			<Grid.Col xs={12} sm={5}>
				<Image
					src={thumbnail ? `${process.env.NEXT_PUBLIC_CDN}${thumbnail}` : '/placeholder.png'}
					alt={title}
					width='864'
					height='486'
				/>
			</Grid.Col>
			<Grid.Col xs={12} sm={7}>
				<Group>
					<ThemeIcon radius='xl' variant='light' size='sm' color='gray'>
						<CalendarStats />
					</ThemeIcon>
					<Text color='grey'>{toLocaleDateFull(publishedAt || createdAt)}</Text>
					<ThemeIcon radius='xl' variant='light' size='sm' color='gray'>
						<User />
					</ThemeIcon>
					<Text color='grey'>{userName}</Text>
				</Group>
				<Space h='xs' />

				<Link href={`${process.env.NEXT_PUBLIC_HOSTNAME}${url}`}>
					<Anchor>
						<Text size='xl' weight='bold'>
							{title}
						</Text>
					</Anchor>
				</Link>

				<Space h='xs' />
				<MediaQuery smallerThan='sm' styles={{display: 'none'}}>
					<Text color='grey'>{strip(article || '')}</Text>
				</MediaQuery>
				<Space h='xs' />
				<Group>
					<Link href={`${process.env.NEXT_PUBLIC_HOSTNAME}${url}`}>
						<Badge variant='gradient' radius='sm' gradient={{from: 'indigo', to: 'cyan'}}>
							Lasīt vairāk
						</Badge>
					</Link>

					{editLink && (
						<Link href={`${process.env.NEXT_PUBLIC_HOSTNAME}editor/${id}`}>
							<Badge variant='gradient' radius='sm' gradient={{from: 'indigo', to: 'red'}}>
								Labot
							</Badge>
						</Link>
					)}
				</Group>
			</Grid.Col>
		</Grid>
		<Space h='xl' />
		<Space h='xl' />
	</>
)

export default NewsArticleCard
