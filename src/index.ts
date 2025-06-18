import assert from 'assert'
import fs from 'fs/promises'
import path from 'path'
import express from 'express'

import {generatePodcastRss} from './generatePodcastRss.js'
import {listMp3Metadata} from './mp3Metadata.js'
import type {Mp3MetadataType} from './mp3Metadata.js'
import {minify} from 'html-minifier'

const PORT = process.env.PORT
assert(PORT, 'PORT environment variable must be set')

const app = express()
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(express.static(path.resolve(import.meta.dirname, './static')))

const getMp3Metadata = async () => {
	try {
		await generatePodcastRss()
		const mp3MetadataList: Mp3MetadataType[] = await listMp3Metadata()
		const htmlList = mp3MetadataList
			.map(metadata => `<li data-src="${metadata.filename}">${metadata.title}</li>`)
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

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}/`))
