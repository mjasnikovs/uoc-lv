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
				<link rel='shortcut icon' href='/favicon.ico' />
			</Head>
			<DefaultSeo
				openGraph={{
					type: 'website',
					locale: 'lv_LV',
					url: process.env.NEXT_PUBLIC_HOSTNAME,
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
					colorScheme: 'dark',
					breakpoints: {
						xs: 576,
						sm: 768,
						md: 992,
						lg: 1200,
						xl: 1400
					}
				}}
			>
				<Component {...pageProps} />
			</MantineProvider>
		</>
	)
}

export default App
