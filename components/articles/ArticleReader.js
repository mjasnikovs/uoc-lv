import 'react-h5-audio-player/lib/styles.css'
import AudioPlayer from 'react-h5-audio-player'

import {Title, Avatar, Grid, Group, ThemeIcon, Text, Badge, Anchor, Button} from '@mantine/core'

import CalendarStats from 'tabler-icons-react/dist/icons/calendar-stats'
import BrandTwitter from 'tabler-icons-react/dist/icons/brand-twitter'
import BrandFacebook from 'tabler-icons-react/dist/icons/brand-facebook'
import Mail from 'tabler-icons-react/dist/icons/mail'

import Image from 'next/image'
import Link from 'next/link'

import {toLocaleDateFull, convertToSlug} from '../../connections/locales'

import ArticleComments from './ArticleComments'
import RichTextEditor from '../RichTextEditor'

const ArticleReader = ({id, url, mp3, userName, userPhoto, title, article, tags, publishedAt, createdAt, session}) => (
	<Grid>
		{session && (
			<Grid.Col span={12}>
				<Group position='right'>
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
				</Group>
			</Grid.Col>
		)}
		<Grid.Col span={10}>
			<Title order={1}>{title}</Title>
		</Grid.Col>
		<Grid.Col span={2}>
			<Group position='right'>
				<Anchor
					href='#'
					onClick={() =>
						window.open(
							`https://twitter.com/intent/tweet?text=${title}&url=` +
								encodeURIComponent(process.env.NEXT_PUBLIC_HOSTNAME + 'article/' + url),
							'twitter-share-dialog',
							'width=626,height=436'
						)
					}
				>
					<ThemeIcon color='blue' variant='light'>
						<BrandTwitter />
					</ThemeIcon>
				</Anchor>

				<Anchor
					href='#'
					onClick={() =>
						window.open(
							'https://www.facebook.com/sharer/sharer.php?u=' +
								encodeURIComponent(process.env.NEXT_PUBLIC_HOSTNAME + 'article/' + url),
							'facebook-share-dialog',
							'width=626,height=436'
						)
					}
				>
					<ThemeIcon color='indigo' variant='light'>
						<BrandFacebook />
					</ThemeIcon>
				</Anchor>

				<Anchor
					href={`mailto:?subject=${title}&amp;body=${title} ${encodeURIComponent(
						process.env.NEXT_PUBLIC_HOSTNAME + 'article/' + url
					)}`}
					title={title}
				>
					<ThemeIcon color='indigo' variant='light'>
						<Mail />
					</ThemeIcon>
				</Anchor>
			</Group>
		</Grid.Col>
		<Grid.Col span={12}>
			<RichTextEditor readOnly key={id} value={article} />
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
						<Badge key={tag} component='a' href={`/tag/${convertToSlug(tag)}`} variant='outline'>
							{tag}
						</Badge>
					))}
				</Group>
				<Group>
					{userPhoto && (
						<Avatar radius='xl'>
							<Image
								src={`${process.env.NEXT_PUBLIC_CDN}${userPhoto}`}
								alt={userName}
								width='56'
								height='56'
							/>
						</Avatar>
					)}
					<Text color='grey'>{userName}</Text>
					<ThemeIcon radius='xl' variant='light' size='sm' color='gray'>
						<CalendarStats />
					</ThemeIcon>
					<Text color='grey'>{toLocaleDateFull(publishedAt || createdAt)}</Text>
				</Group>
			</Group>
		</Grid.Col>
		<Grid.Col span={12}>
			<textarea defaultValue={article} />
		</Grid.Col>
		<Grid.Col span={12}>
			<ArticleComments session={session} id={id} />
		</Grid.Col>
	</Grid>
)

export default ArticleReader
