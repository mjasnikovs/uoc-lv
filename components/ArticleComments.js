import {useState, useEffect} from 'react'
import {useForm} from '@mantine/form'

import {Divider, Loader, Center, Textarea, Button, Space, Grid, Group, Avatar, Text, Anchor} from '@mantine/core'

import ErrorBox from './ErrorBox'
import Image from 'next/image'

import {Check} from 'tabler-icons-react'
import {toLocaleDateFull} from '../connections/locales'

const ArticleComents = ({id}) => {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [success, setSuccess] = useState(null)
	const [comments, setComments] = useState([])

	useEffect(() => {
		fetch(`/api/comments/${id}`, {
			method: 'GET'
		})
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
	}, [id])

	const form = useForm({
		initialValues: {
			content: ''
		}
	})

	const handleSubmit = values => {
		setError(null)
		setSuccess(null)
		setLoading(true)

		fetch(`/api/comments/${id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({...values, id})
		})
			.then(res => res.json())
			.then(res => {
				setLoading(false)
				if (typeof res.error !== 'undefined') {
					return setError(res.error)
				}
				setSuccess(true)
				form.reset()
				return setComments([...comments, res])
			})
			.catch(err => {
				setLoading(false)
				return setError(err.message)
			})
	}

	return (
		<>
			<Divider my='sm' />
			{error && <ErrorBox error={error} />}
			{loading && (
				<Center>
					<Loader color='indigo' size='md' />
				</Center>
			)}
			<Grid>
				{comments.map(comment => (
					<Grid.Col key={comment.id} span={12}>
						<Grid>
							<Grid.Col span={1}>
								<Avatar radius='sm' size='lg'>
									<Image
										src={`${process.env.NEXT_PUBLIC_CDN}${comment.userPhoto}`}
										alt={comment.userName}
										width='56'
										height='56'
									/>
								</Avatar>
							</Grid.Col>
							<Grid.Col span={10}>
								<Group position='apart'>
									<Anchor
										onClick={() =>
											form.setFieldValue('content', `${form.values.content}@${comment.userName}`)
										}
										color='grey'
									>
										{comment.userName}
									</Anchor>
									<Text size='xs'>{toLocaleDateFull(comment.createdAt)}</Text>
								</Group>
								<Text>{comment.content}</Text>
								<Divider my='sm' variant='dotted' />
							</Grid.Col>
						</Grid>
					</Grid.Col>
				))}
			</Grid>
			<Space h='md' />
			<form action='' method='post' onSubmit={form.onSubmit(handleSubmit)}>
				<Textarea
					minrow={5}
					placeholder='Raksti te!'
					label='Tavs komentārs'
					radius='md'
					{...form.getInputProps('content')}
				/>
				<Space h='md' />
				<Button loading={loading} leftIcon={success && <Check size={14} />} type='submit' color='indigo'>
					Komentēt
				</Button>
			</form>
		</>
	)
}

export default ArticleComents
