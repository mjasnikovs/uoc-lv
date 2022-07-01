import {Alert, Space} from '@mantine/core'
import AlertCircle from 'tabler-icons-react/dist/icons/alert-circle'

const ErrorBox = ({error}) => {
	if (typeof error === 'string') {
		return (
			<>
				<Alert icon={<AlertCircle size={16} />} title='Kļūda' color='red'>
					{error}
				</Alert>
				<Space h='md' />
			</>
		)
	}
	return null
}

export default ErrorBox
