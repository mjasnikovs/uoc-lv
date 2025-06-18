import fs from 'fs/promises'
import path from 'path'
import {parseFile} from 'music-metadata'

const MP3_PATH = path.resolve(import.meta.dirname, '../../cdn')

export type Mp3MetadataType = {
	filename: string
	title: string
	artist: string
	album: string
	duration: number
	createdAt: string
}

export const listMp3Metadata: () => Promise<Mp3MetadataType[]> = async () => {
	const files = await fs.readdir(MP3_PATH)
	const mp3Files = files.filter(file => file.endsWith('.mp3'))

	let metadataList = []

	for (const file of mp3Files) {
		const filePath = path.join(MP3_PATH, file)
		const metadata = await parseFile(filePath)
		const stats = await fs.stat(filePath)

		const metadataEntry: Mp3MetadataType = {
			filename: file,
			title: metadata.common.title || 'Unknown Title',
			artist: metadata.common.artist || 'Unknown Artist',
			album: metadata.common.album || 'Unknown Album',
			duration: metadata.format.duration ? Math.round(metadata.format.duration) : 0,
			createdAt: (stats.birthtime || new Date()).toISOString()
		}

		metadataEntry.title = metadataEntry.title.replace(/[$%&#]/g, '').trim()

		metadataList.push(metadataEntry)
	}

	metadataList = metadataList.sort((a, b) => {
		const aa = a.title.match(/\d+/)
		const bb = b.title.match(/\d+/)
		return (bb ? parseInt(bb[0]) : 0) - (aa ? parseInt(aa[0]) : 0)
	})

	return metadataList
}
