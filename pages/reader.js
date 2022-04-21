import fs from 'fs'
import {resolve} from 'path'

import AppShellPage from '../components/AppShellPage'
import ArticleReader from '../components/ArticleReader'

export const getServerSideProps = async () => {
	const value = await fs.promises.readFile(resolve(__dirname, '../../../public/db.txt'), 'utf8')

	return {
		props: {value}
	}
}

const Editor = ({value}) => (
	<AppShellPage>
		<ArticleReader value={value} />
	</AppShellPage>
)

export default Editor
