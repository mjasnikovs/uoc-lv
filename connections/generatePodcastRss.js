import {writeFile, stat} from 'fs/promises'
import path from 'path'

import pg from '../connections/pg'
import logger from '../connections/logger'

const cleanHTML = text =>
	String(text)
		.replace(/<[^>]*>?/gm, '')
		.replace(/&/gm, '&amp;')
		.replace(/</gm, '&lt;')
		.replace(/>/gm, '&gt;')
		.replace(/"/gm, '&quot;')
		.replace(/'/gm, '&#039;')

const HEADER = `
<rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0">
	<channel>
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
        
        <itunes:category text="Leisure" />
        <itunes:category text="Video Games" />
        <itunes:category text="Hobbies" />
`.trim()

const FOOTER = `
    </channel>
</rss>
`.trim()

const generatePodcastRss = async () => {
	try {
		const podcasts = await pg({
			query: `
                select
                    id,
                    to_char("publishedAt" at time zone 'EETDST', 'DD.MM.YYYY HH24:MI') as "publishedAt",
                    title,
                    article,
                    mp3,
                    url,
                    tags,
                    "createdAt"
                from articles
                where status = 'active' and category = 'podcast'
                order by "createdAt" DESC
            `,
			values: [],
			object: false
		})

		const items = await Promise.all(
			podcasts.map(async podcast => {
				const {size} = await stat(path.resolve('./cdn', podcast.mp3.replace(/https:\/\/cdn.uoc.lv\//gm, '')))
				return `
                    <item>
                        <title>${podcast.title}</title>
                        <itunes:author>UOC.LV</itunes:author>
                        <itunes:subtitle>Video spēļu podkāsts</itunes:subtitle>
                        <itunes:summary>${cleanHTML(podcast.article)}</itunes:summary>
                        <itunes:image href="${process.env.NEXT_PUBLIC_HOSTNAME}podcasticon.png" />
                        <enclosure url="${podcast.mp3}" length="${size}" type="audio/mp3" />
                        <guid>${process.env.NEXT_PUBLIC_HOSTNAME}${podcast.url}</guid>
                        <link>${process.env.NEXT_PUBLIC_HOSTNAME}${podcast.url}</link>
                        <pubDate>${podcast.publishedAt}</pubDate>
                        <itunes:keywords>${cleanHTML(podcast.tags.join(', '))}</itunes:keywords>
                    </item>
                `
			})
		)

		const FEED = `${HEADER}${items.join('')}${FOOTER}`

		await writeFile(path.resolve('./cdn', 'uocpodcast.xml'), FEED, 'utf-8')
	} catch (e) {
		logger.error(e)
	}
}

export default generatePodcastRss
