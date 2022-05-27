import pg from '../../connections/pg'
import {format, stringFormat} from 'format-schema'
import logger from '../../connections/logger'

import {withIronSessionApiRoute} from 'iron-session/next'
import ironSessionConfig from '../../../connections/ironSessionConfig'

const test = format({
	title: stringFormat({trim: true, notEmpty: true, max: 200}),
	tags: stringFormat({trim: true, notEmpty: true, toLowerCase: true}),
	category: stringFormat({trim: true, notEmpty: true, enum: ['review', 'news', 'video', 'blog', 'podcast']}),
	status: stringFormat({trim: true, notEmpty: true, enum: ['draft', 'approved', 'active']}),
	article: stringFormat({trim: true, notEmpty: true}),
	notes: stringFormat({trim: true}),
	thumbnail: stringFormat({trim: true}),
	mp3: stringFormat({trim: true})
})

const convertToSlug = text => {
	return text
		.toLowerCase()
		.replace(/[^\w ]+/g, '')
		.replace(/ +/g, '-')
}

const handler = async (req, res) => {
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

		const {title, tags, category, status, article, notes, thumbnail, mp3} = props

		const url = convertToSlug(title)

		return pg
			.query({
				query: `
					insert into articles ("userId", url, title, tags, category, status, article, notes, thumbnail, mp3) 
					values (
						$1::bigint,
						(CONCAT($2, nextval('articles_id_seq'::regclass)))::varchar(300),
						$3::varchar(200),
						$4::text[],
						$5::articles_category_type,
						$6::articles_status_type,
						$7::text,
						$8::text.
						$9::text,
						$10::text
					)
					RETURNING
					*
				`,
				values: [req.session.user.id, url, title, tags, category, status, article, notes, thumbnail, mp3],
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

export default withIronSessionApiRoute(handler, ironSessionConfig)
