import pg from '../connections/postgres'

import AppShellPage from '../components/AppShellPage'
import ArticleEditor from '../components/ArticleEditor'

export const getServerSideProps = async () => {
	const {value} = await pg({query: 'select NOW()::text as value', object: true})

	return {
		props: {value}
	}
}

const Editor = ({value}) => (
	<AppShellPage>
		<ArticleEditor value={value} />
	</AppShellPage>
)

export default Editor
