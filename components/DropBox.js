import React from 'react'
import {Group, Text} from '@mantine/core'
import {FileUpload} from 'tabler-icons-react'

const dropBox = status => (
	<Group position='center' spacing='xl'>
		<FileUpload status={status} size={50} />
		<div>
			<Text size='lg' inline>
				Uzvelc failu šeit vai noklikšķini lai izvēlētos.
			</Text>
			<Text size='sm' color='dimmed' inline mt={7}>
				Faila izmērs nevar pārsniegt 5mb
			</Text>
		</div>
	</Group>
)

export default dropBox
