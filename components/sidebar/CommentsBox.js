import useSWR from 'swr'
import {Space, Grid, Badge, List, Avatar, Skeleton, Anchor} from '@mantine/core'

import Image from 'next/image'
import Link from 'next/link'

import ErrorBox from '../ErrorBox'

const ComentBadgeStyle = {float: 'right', position: 'absolute', right: 0}

const fetcher = (...args) => fetch(...args).then(res => res.json())

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
				<Skeleton height={8} radius='xl' />
				<Skeleton height={8} mt={6} radius='xl' />
				<Skeleton height={8} mt={6} width='70%' radius='xl' />
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
			<List
				style={{position: 'relative'}}
				spacing='lg'
				icon={
					<Avatar color='indigo' radius='xl'>
						UOC
					</Avatar>
				}
			>
				{data.map(comment => (
					<List.Item
						key={comment.id}
						icon={
							comment.userId && (
								<Avatar color='indigo' radius='xl' alt={comment.userName}>
									<Image
										src={`${process.env.NEXT_PUBLIC_CDN}${comment.userPhoto}`}
										alt={comment.userName}
										width='56'
										height='56'
									/>
								</Avatar>
							)
						}
					>
						<Grid gutter='xs'>
							<Grid.Col span={10}>
								<Link href={`/article/${comment.url}`}>
									<Anchor>{comment.title}</Anchor>
								</Link>
							</Grid.Col>
							<Grid.Col span={2}>
								<Badge size='lg' variant='outline' style={ComentBadgeStyle}>
									{comment.count}
								</Badge>
							</Grid.Col>
						</Grid>
					</List.Item>
				))}
			</List>
		</>
	)
}

export default ComentsTab
