import {format, stringFormat, integerFormat} from 'format-schema'

import logger from '../../../connections/logger'
import pg from '../../../connections/pg'
import {getApiRouteSession} from '../../../connections/ironSession'
import {convertToSlug} from '../../../connections/locales'

import fs from 'fs'
import path from 'path'

const test = format({
	id: integerFormat({naturalNumber: true, notEmpty: true, notZero: true}),
	title: stringFormat({trim: true, notEmpty: true, max: 200}),
	tags: stringFormat({trim: true, notEmpty: true, toLowerCase: true}),
	category: stringFormat({trim: true, notEmpty: true, enum: ['review', 'news', 'video', 'blog', 'podcast']}),
	status: stringFormat({trim: true, notEmpty: true, enum: ['draft', 'approved', 'active']}),
	article: stringFormat({trim: true, notEmpty: true}),
	notes: stringFormat({trim: true}),
	thumbnail: stringFormat({trim: true}),
	thumbnailBlur: stringFormat({trim: true, test: /^data:image\/webp;base64,.*$/}),
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

		const {id, title, tags, category, status, article, notes, thumbnail, mp3, thumbnailBlur} = props

		const articleUser = await pg({
			query: 'select "userId", article from articles where id = $1::bigint limit 1',
			values: [id],
			object: true
		})

		if (articleUser === null) {
			return reject(
				new Error(`Sessions don't have appropriate article id.
					The article can't be updated.`)
			)
		}

		if (req.session.user.privileges !== 'administrator' && articleUser.userId !== req.session.user.id) {
			return reject(
				new Error(`Sessions don't have appropriate privileges.
					The article can't be updated.`)
			)
		}

		if (req.session.user.privileges !== 'administrator' && status === 'active') {
			return reject(
				new Error(`Sessions don't have appropriate privileges.
					The article can't be set to status-active.`)
			)
		}

		const tagList = tags
			.split(',')
			.map(v => v.trim())
			.filter(v => !!v)

		const slugTags = tagList.map(convertToSlug)

		const url = convertToSlug(title)

		const oldImageSearch = [...articleUser.article.matchAll(/src="(?:.*?)(?:\/\/)(?:.*?)(?:\/)(.*?\.webp)"/gm)].map(
			img => img[1]
		)
		const newImageSearch = [...article.matchAll(/src="(?:.*?)(?:\/\/)(?:.*?)(?:\/)(.*?\.webp)"/gm)].map(
			img => img[1]
		)

		const deleteImages = oldImageSearch.filter(img => newImageSearch.indexOf(img) === -1)

		if (deleteImages.length !== 0) {
			await Promise.all(
				deleteImages.map(img => {
					return new Promise(cb =>
						fs.unlink(path.resolve('public/cdn/', img), err => {
							if (err) {
								logger.error(err)
							}
							return cb()
						})
					)
				})
			)
		}

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
						"thumbnailBlur" = $11::text,
						mp3 = $12::text
					where id = $1::bigint
					RETURNING
					*
				`,
			values: [
				id,
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

export default getApiRouteSession(updateArticlehandler)
