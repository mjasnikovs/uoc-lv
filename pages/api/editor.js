import fs from 'fs'
import path from 'path'

import getConfig from 'next/config'
const {serverRuntimeConfig} = getConfig()

const file = path.join(serverRuntimeConfig.PROJECT_ROOT, './db.txt')

const handler = async (req, res) => {
	if (req.method === 'POST') {
		await fs.promises.access(file, fs.constants.F_OK).catch(async () => {
			await fs.promises.appendFile(file, '')
		})

		return fs.promises
			.writeFile(file, req.body.text, 'utf8')
			.then(() => res.status(200).send({text: req.body.text}))
			.catch(e => res.status(500).send({error: e.message}))
	}
	return res.status(404).send({error: 'post error'})
}

export default handler
