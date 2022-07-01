import {format, stringFormat} from 'format-schema'

import pg from '../../../connections/pg'
import logger from '../../../connections/logger'
import {getApiRouteSession} from '../../../connections/ironSession'
import {convertToSlug} from '../../../connections/locales'

const test = format({
	title: stringFormat({trim: true, notEmpty: true, max: 200}),
	tags: stringFormat({trim: true, notEmpty: true, toLowerCase: true}),
	category: stringFormat({trim: true, notEmpty: true, enum: ['review', 'news', 'video', 'blog', 'podcast']}),
	status: stringFormat({trim: true, notEmpty: true, enum: ['draft', 'approved', 'active']}),
	article: stringFormat({trim: true, notEmpty: true}),
	notes: stringFormat({trim: true}),
	thumbnail: stringFormat({trim: true}),
	thumbnailBlur: stringFormat({trim: true, test: /^data:image\/webp;base64,.*$/gm}),
	mp3: stringFormat({trim: true})
})

const createArticlehandler = async (req, res) => {
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

		const {title, tags, category, status, article, notes, thumbnail, thumbnailBlur, mp3} = props

		const tagList = tags
			.split(',')
			.map(v => v.trim())
			.filter(v => !!v)

		const slugTags = tagList.map(convertToSlug)

		const url = convertToSlug(title)

		return pg({
			query: `
					insert into articles ("userId", url, title, tags, "slugTags", category, status, article, notes, thumbnail, "thumbnailBlur", mp3) 
					values (
						$1::bigint,
						(CONCAT($2::text,'-',currval('articles_id_seq'::regclass)))::varchar(300),
						$3::varchar(200),
						$4::text[],
						$5::text[],
						$6::articles_category_type,
						$7::articles_status_type,
						$8::text,
						$9::text,
						$10::text,
						$11::text,
						$12::text
					)
					RETURNING
					*
				`,
			values: [
				req.session.user.id,
				url,
				title,
				tagList,
				slugTags,
				category,
				status,
				article,
				notes,
				thumbnail,
				thumbnailBlur,
				mp3
			],
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

export default getApiRouteSession(createArticlehandler)
