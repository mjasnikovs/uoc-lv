import {useState} from 'react'
import RichTextEditor from '../components/RichTextEditor'
import {Button} from '@mantine/core'

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

const handleSave = text =>
	new Promise((resolve, reject) => {
		fetch('/api/editor', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({text})
		})
			.then(response => response.json())
			.catch(err => reject(new Error(err)))
	})

const ArticleEditor = ({value}) => {
	const [text, onChange] = useState(value || '')

	return (
		<>
			<RichTextEditor
				radius='sm'
				value={text}
				onChange={onChange}
				onImageUpload={handleImageUpload}
				style={{minHeight: '600px'}}
			/>
			<Button color='green' onClick={() => handleSave(text)}>
				Saglabāt
			</Button>
		</>
	)
}

export default ArticleEditor
