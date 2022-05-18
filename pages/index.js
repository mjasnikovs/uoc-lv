import AppShellPage from '../components/AppShellPage'
import ArticleCard from '../components/ArticleCard'

import ironSession from '../connections/ironSession'

export const getServerSideProps = ironSession

const Index = ({session}) => (
	<AppShellPage session={session}>
		<ArticleCard id={0} />
		<ArticleCard id={1} />
		<ArticleCard id={2} />
		<ArticleCard id={3} />
		<ArticleCard id={4} />
		<ArticleCard id={5} />
		<ArticleCard id={3} />
		<ArticleCard id={0} />
	</AppShellPage>
)

export default Index
