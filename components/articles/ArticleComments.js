import {useState, useEffect} from 'react'

import {useForm} from '@mantine/form'
import {
	Divider,
	Loader,
	Center,
	Textarea,
	Button,
	Space,
	Grid,
	Group,
	Avatar,
	Text,
	Anchor,
	Alert,
	ActionIcon,
	Modal,
	List
} from '@mantine/core'

import Check from 'tabler-icons-react/dist/icons/check'
import MessageCircle from 'tabler-icons-react/dist/icons/message-circle'
import Edit from 'tabler-icons-react/dist/icons/edit'
import Eraser from 'tabler-icons-react/dist/icons/eraser'
import AlertCircle from 'tabler-icons-react/dist/icons/alert-circle'

import Image from 'next/image'
import Link from 'next/link'

import ErrorBox from '../ErrorBox'

const compareTimeStrings = (createdAt, updatedAt) => {
	const createdAtString = createdAt.split(/[\.,:, ]/).join('')
	const updatedAtString = updatedAt.split(/[\.,:, ]/).join('')
	if (updatedAtString > createdAtString) {
		return `Labots: ${updatedAt}`
	}
	return createdAt
}

const ArticleComents = ({id, session}) => {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [success, setSuccess] = useState(null)
	const [comments, setComments] = useState([])
	const [editCommentId, setEditCommentId] = useState(false)
	const [deleteCommentId, setDeleteCommentId] = useState(false)

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

	const editCommentForm = useForm({
		initialValues: {
			id: null,
			content: ''
		}
	})

	const insertFormValue = val => {
		const content = form.values.content
		form.setFieldValue('content', `${content}${content && ' '}${val}`)
	}

	const replaceUsernames = str =>
		str.split(/\B(@\w+)/gm).map((val, key) => {
			if (/^\B@\w+$/.test(val)) {
				return (
					<Anchor key={val + key} onClick={() => insertFormValue(val)}>
						{val}
					</Anchor>
				)
			}
			return val
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
				return setComments([res, ...comments])
			})
			.catch(err => {
				setLoading(false)
				return setError(err.message)
			})
	}

	const handleEditSubmit = values => {
		setError(null)
		setSuccess(null)
		setLoading(true)

		fetch(`/api/comments/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({...values, id, commentId: editCommentId})
		})
			.then(res => res.json())
			.then(res => {
				setLoading(false)
				if (typeof res.error !== 'undefined') {
					return setError(res.error)
				}
				const commentIndex = comments.findIndex(comment => comment.id === editCommentId)
				comments[commentIndex] = res
				editCommentForm.reset()
				setSuccess(true)
				setEditCommentId(false)
				return setComments(comments)
			})
			.catch(err => {
				setLoading(false)
				return setError(err.message)
			})
	}

	const handleDeleteSubmit = () => {
		setError(null)
		setSuccess(null)
		setLoading(true)

		fetch(`/api/comments/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({id: deleteCommentId})
		})
			.then(res => res.json())
			.then(res => {
				setLoading(false)
				if (typeof res.error !== 'undefined') {
					return setError(res.error)
				}
				const newComments = comments.filter(comment => comment.id !== deleteCommentId)
				setSuccess(true)
				setDeleteCommentId(false)
				return setComments(newComments)
			})
			.catch(err => {
				setLoading(false)
				return setError(err.message)
			})
	}

	return (
		<>
			<Modal
				opened={!!editCommentId}
				onClose={() => setEditCommentId(false)}
				size='xl'
				centered
				title='Rediģēt komentāru'
			>
				<form action='' method='post' onSubmit={editCommentForm.onSubmit(handleEditSubmit)}>
					<Textarea
						minrow={5}
						placeholder='Raksti te!'
						label='Komentārs'
						radius='md'
						{...editCommentForm.getInputProps('content')}
					/>
					<Space h='md' />
					<Button loading={loading} leftIcon={success && <Check size={14} />} type='submit' color='indigo'>
						Labot
					</Button>
				</form>
			</Modal>

			<Modal opened={!!deleteCommentId} onClose={() => setDeleteCommentId(false)} title='Apstiprināt dzēšanu.'>
				<Alert icon={<AlertCircle size={16} />} title='Brīdinājums' color='red'>
					Komentārs tik neatgriezeniski dzēst. Apstiprināt?
				</Alert>
				<Space h='xl' />
				<Button
					loading={loading}
					onClick={handleDeleteSubmit}
					n={success && <Check size={14} />}
					type='submit'
					color='red'
					fullWidth
				>
					Dzēst
				</Button>
			</Modal>
			<Divider my='sm' />
			{error && <ErrorBox error={error} />}
			{loading && (
				<Center>
					<Loader color='indigo' size='md' />
				</Center>
			)}
			{comments.map(comment => (
				<Grid gutter='xs' key={comment.id}>
					<Grid.Col span={12}>
						<Group position='apart'>
							<Anchor onClick={() => insertFormValue(`@${comment.userName}`)} color='grey'>
								<MessageCircle size={16} /> {comment.userName}
							</Anchor>
							<Group>
								<Text size='xs'>{compareTimeStrings(comment.createdAt, comment.updatedAt)}</Text>
								{(session?.privileges === 'administrator' || session?.id === comment.userId) && (
									<ActionIcon
										onClick={() => {
											editCommentForm.setFieldValue('content', comment.content)
											setEditCommentId(comment.id)
										}}
										radius='sm'
										color='indigo'
										size='xs'
									>
										<Edit />
									</ActionIcon>
								)}
								{session?.privileges === 'administrator' && (
									<ActionIcon
										onClick={() => {
											setDeleteCommentId(comment.id)
										}}
										radius='sm'
										color='red'
										size='xs'
									>
										<Eraser />
									</ActionIcon>
								)}
							</Group>
						</Group>
					</Grid.Col>
					<Grid.Col span={12}>
						<List
							spacing='xs'
							icon={
								<Avatar radius='sm' size='lg'>
									{comment.userPhoto ? (
										<Image
											src={`${process.env.NEXT_PUBLIC_CDN}${comment.userPhoto}`}
											alt={comment.userName}
											width='56'
											height='56'
										/>
									) : (
										comment.userName.slice(0, 3)
									)}
								</Avatar>
							}
						>
							<List.Item>{replaceUsernames(comment.content)}</List.Item>
						</List>
						<Divider my='sm' variant='dotted' />
					</Grid.Col>
				</Grid>
			))}
			<Space h='md' />
			{session && (
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
			)}
			{!session && (
				<Alert icon={<MessageCircle size={16} />} title='Vēlies komentēt?' color='gray'>
					<Link href='/login' passHref={true}>
						<Anchor variant='gradient' gradient={{from: 'indigo', to: 'cyan'}}>
							Pieslēgties sistēmai
						</Anchor>
					</Link>
				</Alert>
			)}
		</>
	)
}

export default ArticleComents
