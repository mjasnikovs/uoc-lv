import Head from 'next/head'
import {MantineProvider} from '@mantine/core'
import {NotificationsProvider} from '@mantine/notifications'

const App = props => {
	const {Component, pageProps} = props

	return (
		<>
			<Head>
				<title>Mantine next example</title>
				<meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
				<link rel='shortcut icon' href='/favicon.svg' />
			</Head>
			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{
					/** Put your mantine theme override here */
					colorScheme: 'dark'
				}}>
				<NotificationsProvider>
					<Component {...pageProps} />
				</NotificationsProvider>
			</MantineProvider>
		</>
	)
}

export default App
