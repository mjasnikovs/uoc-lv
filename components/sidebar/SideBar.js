import {useState} from 'react'

import {Space, Input, Badge, Button} from '@mantine/core'
import Search from 'tabler-icons-react/dist/icons/search'

import {useRouter} from 'next/router'

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
					rightSection={
						<Button disabled={search === ''} type='submit'>
							<Search />
						</Button>
					}
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
				{/*<Image src='/discord.png' width='420' height='413' alt='discord' layout='responsive' />*/}
				<iframe
					src='https://discord.com/widget?id=619838999208656906&theme=dark'
					width='100%'
					height='400'
					allowtransparency='true'
					frameBorder='0'
					sandbox='allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts'
				></iframe>
			</div>
		</>
	)
}

export default SideBar
