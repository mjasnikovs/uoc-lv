import RichTextEditor from '../components/RichTextEditor'
import {Title, Avatar, Grid, Group, ThemeIcon, Text, Badge} from '@mantine/core'
import {CalendarStats, BrandTwitter, BrandFacebook, Link} from 'tabler-icons-react'
import Image from 'next/image'

import {toLocaleDateFull, convertToSlug} from '../connections/locales'

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

const ArticleReader = ({userName, userPhoto, title, article, tags, publishedAt, createdAt}) => (
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
		<Grid.Col span={12}>
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
		</Grid.Col>
		<Grid.Col span={12}>
			<Group>
				<Avatar radius='xl'>
					<Image src={`${process.env.NEXT_PUBLIC_CDN}${userPhoto}`} alt={userName} width='150' height='150' />
				</Avatar>
				<Text color='grey'>{userName}</Text>
				<ThemeIcon radius='xl' variant='light' size='sm' color='gray'>
					<CalendarStats />
				</ThemeIcon>
				<Text color='grey'>{toLocaleDateFull(publishedAt || createdAt)}</Text>
			</Group>
		</Grid.Col>
	</Grid>
)

export default ArticleReader
