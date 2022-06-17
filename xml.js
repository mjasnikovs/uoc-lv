const fs = require('fs')
const path = require('path')
const pg = require('./connections/pgreq')
const uploadPictureHandler = require('./connections/uploadpicreq')
const {sync} = require('scpp')
const decodeEscapedHTML = require('./bbc')

const {stringFormat, integerFormat, format} = require('format-schema')

const Parser = require('rss-parser')
const parser = new Parser()

const characterMap = {
	ā: 'a',
	č: 'c',
	ē: 'e',
	ģ: 'g',
	ī: 'i',
	ķ: 'k',
	ļ: 'l',
	ņ: 'n',
	š: 's',
	ū: 'u',
	ž: 'z'
}

const convertToSlug = text =>
	text
		.toLowerCase()
		.replace(/[āčēģīķļņšūž]/gi, v => characterMap[v])
		.replace(/[^\w ]+/g, '')
		.replace(/ +/g, '-')

const USER_ID = 1

const test = format({
	title: stringFormat({notEmpty: true, trim: true}),
	publishedAt: stringFormat({trim: true, test: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/}),
	userId: integerFormat({notEmpty: true, naturalNumber: true, notZero: true}),
	url: stringFormat({notEmpty: true, trim: true}),
	title: stringFormat({notEmpty: true, trim: true}),
	tags: stringFormat({trim: true, notEmpty: true, toLowerCase: true}),
	category: stringFormat({trim: true, notEmpty: true, enum: ['review', 'news', 'video', 'blog', 'podcast']}),
	status: stringFormat({trim: true, notEmpty: true, enum: ['draft', 'approved', 'active']}),
	thumbnail: stringFormat({trim: true, notEmpty: true}),
	mp3: stringFormat({trim: true})
})

const xml = path.resolve(__dirname, './rss300.xml')

const xmlText = fs.readFileSync(xml, 'utf-8')

;(async () => {
	const data = await parser.parseString(xmlText)

	await pg('delete from articles')

	sync(
		data.items.map(val => {
			return (item => {
				return async cb => {
					const parsed = test({
						title: item.title,
						publishedAt: item.isoDate,
						userId: USER_ID,
						url: convertToSlug(item.title),
						title: item.title,
						tags: item.itunes.keywords,
						category: item.categories[0],
						status: 'active',
						thumbnail: item.itunes.image,
						mp3: item.enclosure.url
					})

					if (parsed instanceof Error) {
						return cb(new Error(parsed))
					}

					const {userId, url, title, tags, category, status, notes, thumbnail, mp3, publishedAt} = parsed

					const tagList = tags
						.split(',')
						.map(v => v.trim())
						.filter(v => !!v)

					const slugTags = tagList.map(convertToSlug)

					const uploadThumbImg = await uploadPictureHandler(thumbnail, 'thumbnail').catch(console.error)

					if (!uploadThumbImg) {
						console.error('uploadThumbImg: Error', 'Skiping', title, thumbnail)
						return cb(null)
					}

					let articleHTML = decodeEscapedHTML(item.itunes.summary)
					const images = articleHTML.match(/<img src="(.*?)" \/>/gm)

					await new Promise((resolve, reject) => {
						sync(
							images.map(v => {
								return (image => {
									return async cbS => {
										const imgUrl = /src="(.*?)"/gm.exec(image)

										if (imgUrl[1] === thumbnail) {
											articleHTML = articleHTML.replace(
												new RegExp(`${image}`, 'gm'),
												`<img src="${process.env.NEXT_PUBLIC_CDN}${uploadThumbImg.url}" alt="${item.title}" />`
											)
											return cbS(null)
										}

										await uploadPictureHandler(imgUrl[1])
											.then(uploadImg => {
												articleHTML = articleHTML.replace(
													new RegExp(`${image}`, 'gm'),
													`<img src="${process.env.NEXT_PUBLIC_CDN}${uploadImg.url}" alt="${item.title}" />`
												)
												return cbS(null)
											})
											.catch(err => cbS(err))
									}
								})(v)
							}),
							err => {
								if (err) {
									return reject(err)
								}
								return resolve()
							}
						)
					}).catch(err => {
						console.error('IMG error', 'Skiping', title)
						console.log(err)
						return cb(null)
					})

					pg({
						query: `
							insert into articles (
								"userId",
								url,
								title,
								tags,
								"slugTags",
								category,
								status,
								article,
								notes,
								thumbnail,
								mp3,
								"createdAt",
								"publishedAt",
								"updatedAt",
								"commentedAt"
							) 
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
								$12::timestamp with time zone,
								$13::timestamp with time zone,
								$14::timestamp with time zone,
								$15::timestamp with time zone
							)
						`,
						values: [
							userId,
							url,
							title,
							tagList,
							slugTags,
							category,
							status,
							articleHTML,
							notes,
							uploadThumbImg.url,
							mp3,
							publishedAt,
							publishedAt,
							publishedAt,
							publishedAt
						],
						object: true
					})
						.then(() => cb(null))
						.catch(err => {
							console.log({
								values: {
									userId,
									url,
									title,
									tagList,
									slugTags,
									category,
									status,
									articleHTML,
									notes,
									thumbnail: uploadThumbImg.url,
									mp3,
									publishedAt,
									publishedAt,
									publishedAt,
									publishedAt
								}
							})
							return cb(new Error(err))
						})
				}
			})(val)
		}),
		err => {
			if (err) {
				console.error(err)
				process.exit(1)
			}
			console.log('Save done')
			process.exit(0)
		}
	)
})()
