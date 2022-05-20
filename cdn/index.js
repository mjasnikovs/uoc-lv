const express = require('express')
const port = process.env.FILESERVER_PORT

const fs = require('fs')
const path = require('path')
const busboy = require('busboy')
const sharp = require('sharp')
const {format, integerFormat, stringFormat} = require('format-schema')

const pino = require('pino')
const logger = pino()

const imageUploadFieldTest = format({
	width: integerFormat({notEmpty: true, notUndef: true, notZero: true, naturalNumber: true}),
	height: integerFormat({notEmpty: true, notUndef: true, notZero: true, naturalNumber: true})
})

const deleteFieldTest = format({
	name: stringFormat({notEmpty: true, notUndef: true, trim: true, test: /^[A-Za-z0-9+/]*\.webp$/})
})

const app = express()
app.use(express.static(path.resolve(__dirname, './public')))

app.post('/delete', async (req, res) => {
	const bb = busboy({headers: req.headers})

	let count = 0

	const formFieldMap = new Map()
	bb.on('field', (fieldname, val) => {
		formFieldMap.set(fieldname, val)
	})

	bb.on('finish', () => {
		const fields = deleteFieldTest({
			name: String(formFieldMap.get('name')).replace(process.env.FILESERVER_HOSTNAME, '')
		})

		if (fields instanceof Error) {
			return res.status(400).send(fields.message.replace())
		}

		const fullPath = path.resolve(__dirname, './public/', fields.name)

		fs.access(fullPath, fs.constants.F_OK, err => {
			if (err) {
				return res.status(400).send('File does not exists')
			}
			fs.unlink(fullPath, e => {
				if (e) {
					return res.status(500).send(new Error(e))
				}
				return res.status(200).send()
			})
		})
	})

	bb.on('error', err => {
		if (count++ === 0) {
			logger.error(err)
			return res.status(500).send(new Error(err))
		}
	})

	req.pipe(bb)
})

app.post('/uploadimage', async (req, res) => {
	const bb = busboy({headers: req.headers, limits: {files: 1, fileSize: 5 * 1048576}})
	let count = 0

	const formFieldMap = new Map()
	bb.on('field', (fieldname, val) => {
		formFieldMap.set(fieldname, val)
	})

	bb.on('file', async (name, file, {filename, mimeType}) => {
		if (['image/jpeg', 'image/jpg', 'image/png'].indexOf(mimeType) === -1) {
			file.resume()
			logger.info(`Image mimeType is invalid :"${mimeType}".`)
			return res.status(400).send(`Image mimeType is invalid :"${mimeType}".`)
		}

		const type = mimeType.split('/')
		const tempPath = path.resolve('temp/', `${Buffer.from(filename).toString('base64url').slice(0, 10)}.${type[1]}`)

		const fstream = fs.createWriteStream(tempPath)
		file.pipe(fstream)

		file.on('limit', () => {
			if (count++ === 0) {
				logger.info('Image filesize limit.')
				return res.status(400).send('Image filesize limit.')
			}
		})

		fstream.on('finish', async () => {
			const webp = await new Promise(resolve => {
				const generateWebpUrl = () => {
					const webpName = `${Buffer.from(new Date().getTime() + filename)
						.toString('base64url')
						.slice(0, 25)}.webp`
					const webpPath = path.resolve(__dirname, './public/', webpName)

					return {webpName, webpPath}
				}

				const filePathExists = () => {
					const f = generateWebpUrl()
					fs.access(f.webpPath, fs.constants.F_OK, err => (err ? resolve(f) : filePathExists()))
				}
				return filePathExists()
			})

			const fields = imageUploadFieldTest({width: formFieldMap.get('width'), height: formFieldMap.get('height')})

			if (fields instanceof Error) {
				return res.status(400).send(fields.message)
			}

			return sharp(tempPath)
				.resize({
					...fields,
					fit: sharp.fit.cover
				})
				.webp()
				.toFile(webp.webpPath)
				.then(() => {
					fs.unlink(tempPath, e => e && logger.error(e))
					if (count++ === 0) {
						return res.status(200).send({url: `${process.env.FILESERVER_HOSTNAME}${webp.webpName}`})
					}
				})
				.catch(err => {
					fs.unlink(tempPath, e => e && logger.error(e))
					if (count++ === 0) {
						logger.error(err)
						return res.status(500).send(new Error(err))
					}
				})
		})
	})

	bb.on('error', err => {
		if (count++ === 0) {
			logger.error(err)
			return res.status(500).send(new Error(err))
		}
	})

	req.pipe(bb)
})

app.listen(port, () => {
	console.log(`File server running on ${port}`)
})
