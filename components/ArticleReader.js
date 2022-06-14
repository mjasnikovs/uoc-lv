import 'react-h5-audio-player/lib/styles.css'
import AudioPlayer from 'react-h5-audio-player'

import {Title, Avatar, Grid, Group, ThemeIcon, Text, Badge} from '@mantine/core'
import {CalendarStats, BrandTwitter, BrandFacebook, Link} from 'tabler-icons-react'
import Image from 'next/image'

import {toLocaleDateFull, convertToSlug} from '../connections/locales'

import ArticleComments from './ArticleComments'
import RichTextEditor from './RichTextEditor'

const ArticleReader = ({id, mp3, userName, userPhoto, title, article, tags, publishedAt, createdAt, session}) => (
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
						<Badge key={tag} component='a' href={`/tags/${convertToSlug(tag)}`} variant='outline'>
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
			<ArticleComments session={session} id={id} />
		</Grid.Col>
	</Grid>
)

export default ArticleReader
