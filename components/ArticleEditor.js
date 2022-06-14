import RichTextEditor from '../components/RichTextEditor'

const handleImageUpload = file =>
	new Promise((resolve, reject) => {
		const formData = new FormData()
		formData.append('image', file)

		fetch('/api/uploadpicture', {
			method: 'POST',
			body: formData
		})
			.then(res => res.json())
			.then(res => {
				if (typeof res.error !== 'undefined') {
					return reject(res.error)
				}
				return resolve(`${process.env.NEXT_PUBLIC_CDN}${res.url}`)
			})
			.catch(err => reject(err.message))
	})

const ArticleEditor = props => (
	<RichTextEditor
		radius='sm'
		{...props}
		onImageUpload={handleImageUpload}
		style={{minHeight: '600px'}}
		controls={[
			['bold', 'italic'],
			['blockquote', 'code'],
			['h2', 'h3', 'h4', 'h5', 'h6'],
			['alignLeft', 'alignCenter', 'alignRight'],
			['unorderedList', 'orderedList'],
			['link', 'video', 'image']
		]}
	/>
)

export default ArticleEditor
