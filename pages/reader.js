import fs from 'fs'
import path from 'path'

import getConfig from 'next/config'
const {serverRuntimeConfig} = getConfig()

import AppShellPage from '../components/AppShellPage'
import ArticleReader from '../components/ArticleReader'

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
		<ArticleReader value={value} />
	</AppShellPage>
)

export default Editor
