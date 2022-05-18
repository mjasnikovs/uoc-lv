import {withIronSessionSsr} from 'iron-session/next'
import ironSessionConfig from '../connections/ironSessionConfig'
import {useRouter} from 'next/router'

export const getServerSideProps = withIronSessionSsr(({req, res}) => {
	req.session.destroy()
	res.writeHead(302, {Location: '/'})
	res.end()
	return {props: {}}
}, ironSessionConfig)

const DeleteSession = () => {
	const router = useRouter()
	router.push('/')
	return null
}

export default DeleteSession
