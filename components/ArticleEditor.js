import {useState} from 'react'
import RichTextEditor from '../components/RichTextEditor'

const handleImageUpload = file =>
	new Promise((resolve, reject) => {
		const formData = new FormData()
		formData.append('image', file)

		fetch('https://api.imgbb.com/1/upload?key=48b01f66783c6a29ee54ea90295dede9', {
			method: 'POST',
			body: formData
		})
			.then(response => response.json())
			.then(result => resolve(result.data.url))
			.catch(() => reject(new Error('Upload failed')))
	})

const ArticleEditor = () => {
	const [value, onChange] = useState('')

	return (
		<RichTextEditor
			radius='sm'
			value={value}
			onChange={onChange}
			onImageUpload={handleImageUpload}
			style={{minHeight: '600px'}}
		/>
	)
}

export default ArticleEditor
