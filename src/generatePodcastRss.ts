import {writeFile} from 'fs/promises'
import path from 'path'
import assert from 'assert'

import {listMp3Metadata} from './mp3Metadata.js'
import type {Mp3MetadataType} from './mp3Metadata.js'

assert(process.env.MP3_PATH, 'MP3_PATH environment variable must be set')
const MP3_PATH = path.resolve(process.env.MP3_PATH)

const HEADER = `
<rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
        <atom:link href="https://cdn.uoc.lv/uocpodcast.xml" rel="self" type="application/rss+xml" />
		<title>UOC.LV Podkāsts</title>
        <link>http://uoc.lv/</link>
        <language>lv</language>
        <copyright>UOC.LV</copyright>
        <itunes:subtitle>Video spēļu podkāsts</itunes:subtitle>
        <itunes:author>UOC.LV</itunes:author>
        <itunes:summary>UOC.LV Podkāsts ir šovs ar video spēļu tematiku. Brīvā gaisotnē podkāsta dalībnieki apspriež dzīvi, spēles un interesantus notikumus.</itunes:summary>
        <description>UOC.LV Podkāsts ir šovs ar video spēļu tematiku. Brīvā gaisotnē podkāsta dalībnieki apspriež dzīvi, spēles un interesantus notikumus.</description>
        
        <itunes:owner>
        <itunes:name>UOC.LV</itunes:name>
        <itunes:email>info@uoc.lv</itunes:email>
        </itunes:owner>
        
        <itunes:image href="https://uoc.lv/podcasticon.png" />
        
	    <itunes:category xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" text="Leisure">
			<itunes:category text="Video Games"/>
		</itunes:category>
		<itunes:category xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" text="Technology">
		</itunes:category>
		<itunes:category xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" text="Leisure">
			<itunes:category text="Hobbies"/>
		</itunes:category>	

		<itunes:explicit>no</itunes:explicit>	
`.trim()

const FOOTER = `
    </channel>
</rss>
`.trim()

export const generatePodcastRss = async () => {
	const mp3MetadataList: Mp3MetadataType[] = await listMp3Metadata()

	const items = mp3MetadataList.map(podcast => {
		return `
			<item>
				<title>${podcast.title}</title>
				<itunes:title>${podcast.title}</itunes:title>
				<itunes:author>UOC.LV</itunes:author>
				<itunes:subtitle>Video spēļu podkāsts</itunes:subtitle>
				<itunes:summary>${podcast.album}</itunes:summary>
				<itunes:image href="https://uoc.lv/podcasticon.png" />
				<enclosure url="https://cdn.uoc.lv/${podcast.filename}" length="${podcast.duration * 1000}" type="audio/mpeg" />
				<guid>https://cdn.uoc.lv/${podcast.filename}</guid>
				<link>https://uoc.lv/${podcast.filename.replace('.mp3', '')}</link>
				<pubDate>${new Date(podcast.createdAt).toUTCString()}</pubDate>
				<itunes:keywords>video spēles, podkāsts, uoc.lv</itunes:keywords>
			</item>
		`
	})

	const FEED = `${HEADER}${items.join('')}${FOOTER}`

	await writeFile(path.resolve(MP3_PATH, 'uocpodcast.xml'), FEED, 'utf-8')
}
