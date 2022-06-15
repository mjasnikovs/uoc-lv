import {useEffect, useState} from 'react'
import {Space, Grid, Badge, List, Avatar, Skeleton, Anchor} from '@mantine/core'

import Image from 'next/image'
import Link from 'next/link'

import ErrorBox from '../ErrorBox'

const ComentBadgeStyle = {float: 'right', position: 'absolute', right: 0}

const ComentsTab = () => {
	const [comments, setComments] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		setLoading(true)
		fetch('/api/comments/newestcomments')
			.then(res => res.json())
			.then(res => {
				if (typeof res.error !== 'undefined') {
					setLoading(false)
					return setError(res.error)
				}
				setLoading(false)
				return setComments(res)
			})
			.catch(err => setError(err.message))
	}, [])

	if (loading) {
		return (
			<>
				<Badge variant='gradient' radius='sm' gradient={{from: 'indigo', to: 'cyan'}} fullWidth>
					komentāri
				</Badge>
				<Space h='xl' />
				{error && <ErrorBox error={error} />}
				<Space h='xl' />
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
				{comments.map(comment => (
					<List.Item
						key={comment.id}
						icon={
							comment.userId && (
								<Avatar color='indigo' radius='xl' alt="it's me">
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
								<Link href={`${process.env.NEXT_PUBLIC_HOSTNAME}${comment.url}`}>
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
