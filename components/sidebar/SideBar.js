import {useState} from 'react'

import {Space, Input, Badge} from '@mantine/core'
import {Search} from 'tabler-icons-react'

import {useRouter} from 'next/router'
import Image from 'next/image'

import CommentsBox from './CommentsBox'

const SideBar = () => {
	const router = useRouter()
	const [search, setSearch] = useState('')

	const handleSubmit = e => {
		e.preventDefault()
		router.push('/search/' + search)
	}

	return (
		<>
			<form action='' method='post' onSubmit={handleSubmit}>
				<Input
					icon={<Search />}
					placeholder='Meklēt'
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
			</form>
			<Space h='xl' />
			<Space h='xl' />
			<CommentsBox />
			<Space h='xl' />
			<Badge variant='gradient' radius='sm' gradient={{from: 'indigo', to: 'cyan'}} fullWidth>
				Discord
			</Badge>
			<Space h='xl' />
			<div
				style={{
					border: 'none',
					borderRadius: '5px',
					overflow: 'hidden',
					position: 'relative',
					height: '400px'
				}}
			>
				<Image src='/discord.png' width='400' height='400' alt='discord' />
				{/*<iframe
				src='https://discord.com/widget?id=619838999208656906&theme=dark'
				width='100%'
				height='400'
				allowtransparency='true'
				frameBorder='0'
				sandbox='allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts'
			></iframe>*/}
			</div>
		</>
	)
}

export default SideBar
