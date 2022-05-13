import pg from '../../connections/pg'

const handler = async (req, res) => {
	if (req.method === 'POST') {
		return pg({
			query: 'update test set message = $1::text',
			values: [req.body.text]
		})
			.then(() => res.status(200).send({text: req.body.text}))
			.catch(e => res.status(500).send({error: e.message}))
	}
	return res.status(404).send({error: 'post error'})
}

export default handler
