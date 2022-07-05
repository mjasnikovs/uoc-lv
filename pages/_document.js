import {createGetInitialProps} from '@mantine/next'
import Document, {Head, Html, Main, NextScript} from 'next/document'

const getInitialProps = createGetInitialProps()

export default class _Document extends Document {
	static getInitialProps = getInitialProps

	render() {
		return (
			<Html lang='lv'>
				<Head>
					<meta charSet='utf-8' />
					<link rel='shortcut icon' href='/favicon.ico' />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}
