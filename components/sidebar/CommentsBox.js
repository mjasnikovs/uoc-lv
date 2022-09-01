import {Fragment} from 'react'
import useSWR from 'swr'
import {Space, Grid, Badge, Avatar, Skeleton, Anchor} from '@mantine/core'

import Image from 'next/image'
import Link from 'next/link'

import ErrorBox from '../ErrorBox'

const fetcher = (...args) => fetch(...args).then(res => res.json())

const DisplayAvatar = comment => {
	if (comment.userId && comment.userPhoto) {
		return (
			<Avatar color='indigo' radius='xl' alt={comment.userName}>
				<Image
					src={`${process.env.NEXT_PUBLIC_CDN}${comment.userPhoto}`}
					alt={comment.userName}
					width='56'
					height='56'
				/>
			</Avatar>
		)
	} else if (comment.userId) {
		return (
			<Avatar color='indigo' radius='xl' alt={comment.userName}>
				{comment.userName.slice(0, 3)}
			</Avatar>
		)
	}

	return (
		<Avatar color='indigo' radius='xl'>
			UOC
		</Avatar>
	)
}

const ComentsTab = () => {
	const {data, error} = useSWR('/api/comments/newestcomments', fetcher)

	if (!data) {
		return (
			<>
				<Badge variant='gradient' radius='sm' gradient={{from: 'indigo', to: 'cyan'}} fullWidth>
					komentāri
				</Badge>
				<Space h='xl' />
				{error && <ErrorBox error={error} />}
				{Array(10)
					.fill()
					.map((_, key) => (
						<Grid gutter='xs' key={key}>
							<Grid.Col span={2}>
								<Skeleton height={38} circle mb='xl' radius='xl' />
							</Grid.Col>
							<Grid.Col span={8}>
								<Skeleton height={10} width='90%' radius='xl' />
								<Skeleton height={10} mt={5} width='60%' radius='xl' />
								<Skeleton height={10} mt={5} width='60%' radius='xl' />
							</Grid.Col>
							<Grid.Col span={2}>
								<Skeleton height={20} circle mb='xl' radius='xl' />
							</Grid.Col>
						</Grid>
					))}
			</>
		)
	}

	return (
		<>
			<Badge variant='gradient' radius='sm' gradient={{from: 'indigo', to: 'cyan'}} fullWidth>
				komentāri
			</Badge>
			<Space h='xl' />
			{error && <ErrorBox error={error} />}
			{data.map(comment => (
				<Grid gutter='xl' key={comment.id} columns={24}>
					<Grid.Col span={3}>
						<DisplayAvatar comment={comment} />
					</Grid.Col>
					<Grid.Col span={18}>
						<Link href={`/article/${comment.url}`} passHref={true}>
							<Anchor>{comment.title}</Anchor>
						</Link>
					</Grid.Col>
					<Grid.Col span={3}>
						<Badge size='lg' variant='outline' style={{float: 'right'}}>
							{comment.count}
						</Badge>
					</Grid.Col>
				</Grid>
			))}
		</>
	)
}

export default ComentsTab
