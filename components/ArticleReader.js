import 'react-h5-audio-player/lib/styles.css'
import RichTextEditor from '../components/RichTextEditor'
import {Title, Avatar, Grid, Group, ThemeIcon, Text, Badge} from '@mantine/core'
import {CalendarStats, BrandTwitter, BrandFacebook, Link} from 'tabler-icons-react'
import Image from 'next/image'
import AudioPlayer from 'react-h5-audio-player'

import {toLocaleDateFull, convertToSlug} from '../connections/locales'
import ArticleComments from './ArticleComments'

// a.id,
// to_char(a."updatedAt" at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as "updatedAt",
// to_char(a."createdAt" at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as "createdAt",
// to_char(a."publishedAt" at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as "publishedAt",
// a."userId",
// u.name as "userName",
// a.url,
// a.title,
// a.tags,
// a.category,
// a.status,
// a.article,
// a.notes,
// a.thumbnail,
// a.mp3

const ArticleReader = ({id, mp3, userName, userPhoto, title, article, tags, publishedAt, createdAt}) => (
	<Grid>
		<Grid.Col span={10}>
			<Title order={1}>{title}</Title>
		</Grid.Col>
		<Grid.Col span={2}>
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
			<RichTextEditor readOnly value={article} />
		</Grid.Col>
		{mp3 && (
			<Grid.Col>
				<AudioPlayer
					customAdditionalControls={[]}
					layout='horizontal'
					autoPlayAfterSrcChange={false}
					showJumpControls={false}
					src={mp3}
				/>
			</Grid.Col>
		)}
		<Grid.Col span={12}>
			<Group position='apart'>
				<Group spacing='xs'>
					{tags.map(tag => (
						<Badge
							key={tag}
							component='a'
							href={`${process.env.NEXT_PUBLIC_HOSTNAME}tags/${convertToSlug(tag)}`}
							variant='outline'
						>
							{tag}
						</Badge>
					))}
				</Group>
				<Group>
					<Avatar radius='xl'>
						<Image
							src={`${process.env.NEXT_PUBLIC_CDN}${userPhoto}`}
							alt={userName}
							width='56'
							height='56'
						/>
					</Avatar>
					<Text color='grey'>{userName}</Text>
					<ThemeIcon radius='xl' variant='light' size='sm' color='gray'>
						<CalendarStats />
					</ThemeIcon>
					<Text color='grey'>{toLocaleDateFull(publishedAt || createdAt)}</Text>
				</Group>
			</Group>
		</Grid.Col>
		<Grid.Col span={12}>
			<ArticleComments id={id} />
		</Grid.Col>
	</Grid>
)

export default ArticleReader
