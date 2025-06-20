import fs from 'fs/promises'
import path from 'path'
import express from 'express'

import {generatePodcastRss} from './generatePodcastRss.js'
import {listMp3Metadata} from './mp3Metadata.js'
import type {Mp3MetadataType} from './mp3Metadata.js'
import {minify} from 'html-minifier'

const app = express()
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(express.static(path.resolve(import.meta.dirname, './static')))

const getMp3Metadata = async () => {
	try {
		await generatePodcastRss()
		const mp3MetadataList: Mp3MetadataType[] = await listMp3Metadata()
		const htmlList = mp3MetadataList
			.map(metadata => `<li data-src="https://cdn.uoc.lv/${metadata.filename}">${metadata.title}</li>`)
			.join('\n')

		const template = await fs.readFile(path.resolve(import.meta.dirname, './static/index.html'), 'utf8')

		const html_file = minify(
			template.replace(
				/<ul\s+class=["']playlist["'][^>]*>[\s\S]*?<\/ul>/gi,
				`<ul class="playlist">${htmlList}</ul>`
			)
		)
		await fs.writeFile(path.resolve(import.meta.dirname, './static/index.html'), html_file, 'utf8')
	} catch (error) {
		console.error('Error fetching MP3 metadata:', error)
	}
}

getMp3Metadata()

setInterval(() => void getMp3Metadata(), 1000 * 60 * 30)

app.get('/uoc.lv-podkasts-:episodeNumber', async (_, res) => {
	try {
		const html = await fs.readFile(path.resolve(import.meta.dirname, './static/index.html'), 'utf8')
		res.send(html)
	} catch (error) {
		console.error('Error reading index.html:', error)
		res.status(500).send('Internal Server Error')
	}
})

app.listen(80, () => console.log('Server running at http://localhost:80/'))
