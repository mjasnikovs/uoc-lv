import {format, stringFormat, integerFormat} from 'format-schema'

import logger from '../../../connections/logger'
import pg from '../../../connections/pg'
import {getApiRouteSession} from '../../../connections/ironSession'
import {convertToSlug} from '../../../connections/locales'

const test = format({
	id: integerFormat({naturalNumber: true, notEmpty: true, notZero: true}),
	title: stringFormat({trim: true, notEmpty: true, max: 200}),
	tags: stringFormat({trim: true, notEmpty: true, toLowerCase: true}),
	category: stringFormat({trim: true, notEmpty: true, enum: ['review', 'news', 'video', 'blog', 'podcast']}),
	status: stringFormat({trim: true, notEmpty: true, enum: ['draft', 'approved', 'active']}),
	article: stringFormat({trim: true, notEmpty: true}),
	notes: stringFormat({trim: true}),
	thumbnail: stringFormat({trim: true}),
	mp3: stringFormat({trim: true})
})

const updateArticlehandler = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(404).send({error: 'Route accepts only post requests. The non-post request was requested.'})
	}

	if (typeof req.session.user === 'undefined') {
		return res.status(200).redirect(307, '/')
	}

	return new Promise(async (resolve, reject) => {
		const props = test(req.body)

		if (props instanceof Error) {
			return reject(new Error(props))
		}

		const {id, title, tags, category, status, article, notes, thumbnail, mp3} = props

		const tagList = tags
			.split(',')
			.map(v => v.trim())
			.filter(v => !!v)

		const slugTags = tagList.map(convertToSlug)

		const url = convertToSlug(title)

		return pg({
			query: `
					update articles set 
						url = (CONCAT($2::text,'-',id))::varchar(300),
						title = $3::varchar(200),
						tags = $4::text[],
						"slugTags" = $5::text[],
						category = $6::articles_category_type,
						status = $7::articles_status_type,
						article = $8::text,
						notes = $9::text,
						thumbnail = $10::text,
						mp3 = $11::text
					where id = $1::bigint
					RETURNING
					*
				`,
			values: [id, url, title, tagList, slugTags, category, status, article, notes, thumbnail, mp3],
			object: true
		})
			.then(resolve)
			.catch(err => reject(new Error(err)))
	})
		.then(article => {
			return res.status(200).send(article)
		})
		.catch(err => {
			logger.error(err)
			return res.status(500).send({error: err.message})
		})
}

export default getApiRouteSession(updateArticlehandler)
