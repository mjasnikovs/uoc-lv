import fs from 'fs'
import {resolve} from 'path'

import AppShellPage from '../components/AppShellPage'
import ArticleEditor from '../components/ArticleEditor'

export const getServerSideProps = async () => {
	const value = await fs.promises.readFile(resolve(__dirname, '../../../db.txt'), 'utf8')

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
