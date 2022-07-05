import '../styles/react-h5-audio-player.css'
import Head from 'next/head'
import {MantineProvider} from '@mantine/core'
import {DefaultSeo} from 'next-seo'

const App = props => {
	const {Component, pageProps} = props

	return (
		<>
			<Head>
				<meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
			</Head>
			<DefaultSeo
				title='UOC.LV video spēļu un citu hobiju portāls'
				description='video spēļu un citu hobiju portāls'
				openGraph={{
					title: 'UOC.LV video spēļu un citu hobiju portāls',
					description: 'video spēļu un citu hobiju portāls',
					url: process.env.NEXT_PUBLIC_HOSTNAME,
					type: 'website',
					locale: 'lv_LV',
					site_name: 'uoc.lv'
				}}
				twitter={{
					handle: '@lielaiswuu',
					site: '@uoc.lv',
					cardType: 'summary_large_image'
				}}
			/>
			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{
					/** Put your mantine theme override here */
					colorScheme: 'dark'
				}}
			>
				<Component {...pageProps} />
			</MantineProvider>
		</>
	)
}

export default App
