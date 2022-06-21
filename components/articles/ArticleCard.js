import {Text, Space, Anchor, Grid, Group, ThemeIcon, MediaQuery, Button} from '@mantine/core'
import {CalendarStats, User} from 'tabler-icons-react'

import {toLocaleDateFull, strip} from '../../connections/locales'

import Link from 'next/link'
import Image from 'next/image'

const NewsArticleCard = ({id, userName, thumbnail, publishedAt, title, url, article, createdAt, editLink}) => (
	<>
		<Grid>
			<Grid.Col xs={12} sm={5}>
				<Image
					src={thumbnail ? `${process.env.NEXT_PUBLIC_CDN}${thumbnail}` : '/placeholder.png'}
					alt={title}
					width='689'
					height='387'
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

				<Link href={`/article/${url}`}>
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
					<Link href={`/article/${url}`}>
						<Button
							variant='gradient'
							compact
							radius='sm'
							size='xs'
							uppercase
							gradient={{from: 'indigo', to: 'cyan'}}
						>
							Lasīt vairāk
						</Button>
					</Link>

					{editLink && (
						<Link href={`/editor/${id}`}>
							<Button
								variant='gradient'
								compact
								radius='sm'
								size='xs'
								uppercase
								gradient={{from: 'indigo', to: 'red'}}
							>
								Labot
							</Button>
						</Link>
					)}
				</Group>
			</Grid.Col>
		</Grid>
		<Space h='xl' />
	</>
)

export default NewsArticleCard
