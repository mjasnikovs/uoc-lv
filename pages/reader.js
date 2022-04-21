import fs from 'fs'
import path from 'path'

import getConfig from 'next/config'
const {serverRuntimeConfig} = getConfig()

import AppShellPage from '../components/AppShellPage'
import ArticleReader from '../components/ArticleReader'

export const getServerSideProps = async () => {
	const value = await fs.promises.readFile(path.join(serverRuntimeConfig.PROJECT_ROOT, './db.txt'), 'utf8')

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
