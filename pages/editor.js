import pg from '../connections/pg'

import AppShellPage from '../components/AppShellPage'
import ArticleEditor from '../components/ArticleEditor'

export const getServerSideProps = async () => {
	const result = await pg({
		query: 'select message::text as value from test order by id limit 1',
		object: true
	})

	return {
		props: {value: result?.value || ''}
	}
}

const Editor = ({value}) => (
	<AppShellPage>
		<ArticleEditor value={value} />
	</AppShellPage>
)

export default Editor
