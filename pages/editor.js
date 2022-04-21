import fs from 'fs'
import path from 'path'

import getConfig from 'next/config'
const {serverRuntimeConfig} = getConfig()

import AppShellPage from '../components/AppShellPage'
import ArticleEditor from '../components/ArticleEditor'

const file = path.join(serverRuntimeConfig.PROJECT_ROOT, './db.txt')

export const getServerSideProps = async () => {
	await fs.promises.access(file, fs.constants.F_OK).catch(async () => {
		await fs.promises.appendFile(file, '')
	})

	const value = await fs.promises.readFile(file, 'utf8')

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
