import {withIronSessionSsr} from 'iron-session/next'
import {ironSessionSettings} from '../connections/ironSession'
import {useRouter} from 'next/router'

export const getServerSideProps = withIronSessionSsr(({req, res}) => {
	req.session.destroy()
	res.writeHead(302, {Location: '/'})
	res.end()
	return {props: {}}
}, ironSessionSettings)

const Logout = () => {
	const router = useRouter()
	router.push('/')
	return null
}

export default Logout
