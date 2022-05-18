import {withIronSessionSsr} from 'iron-session/next'
import ironSessionConfig from '../connections/ironSessionConfig'

const getServerSideProps = withIronSessionSsr(async ({req}) => {
	return {
		props: {
			session: req.session.user || null
		}
	}
}, ironSessionConfig)

export default getServerSideProps
