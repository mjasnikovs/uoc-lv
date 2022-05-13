import pg from '../connections/pg'

import AppShellPage from '../components/AppShellPage'
import ArticleReader from '../components/ArticleReader'

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
		<ArticleReader value={value} />
	</AppShellPage>
)

export default Editor
