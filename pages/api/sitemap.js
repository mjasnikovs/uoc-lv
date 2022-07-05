import {SitemapStream, streamToPromise} from 'sitemap'
import logger from '../../connections/logger'
import pg from '../../connections/pg'

const Sitemap = async (req, res) => {
	try {
		const smStream = new SitemapStream({
			hostname: `https://${req.headers.host}`,
			cacheTime: 600000
		})

		const articles = await pg('select url from articles')

		articles.forEach(article => {
			smStream.write({
				url: `/article/${article.url}`,
				changefreq: 'daily',
				priority: 0.9
			})
		})

		smStream.end()

		const sitemapOutput = (await streamToPromise(smStream)).toString()

		res.writeHead(200, {
			'Content-Type': 'application/xml'
		})

		res.end(sitemapOutput)
	} catch (e) {
		logger.error(e)
		res.send(JSON.stringify(e))
	}
}

export default Sitemap
