import {Footer, Text, Container, Anchor, Grid, Group, ThemeIcon, Divider, Stack, Center} from '@mantine/core'

import Link from 'next/link'

import BrandTwitter from 'tabler-icons-react/dist/icons/brand-twitter'
import BrandFacebook from 'tabler-icons-react/dist/icons/brand-facebook'
import BrandYoutube from 'tabler-icons-react/dist/icons/brand-youtube'
import BrandTwitch from 'tabler-icons-react/dist/icons/brand-twitch'
import Mail from 'tabler-icons-react/dist/icons/mail'
import BrandDiscord from 'tabler-icons-react/dist/icons/brand-discord'

const FooterPage = () => (
	<Footer p='md'>
		<Container size='xl'>
			<Grid>
				<Grid.Col xs={6} md={3}>
					<Stack>
						<Text weight='bold'>Kategorijas</Text>
						<Divider color='indigo' size='sm' />
						<Link href='/' passHref={true}>
							<Anchor>Sākums</Anchor>
						</Link>
						<Link href='/tag/podkasts' passHref={true}>
							<Anchor>Podkāsts</Anchor>
						</Link>
					</Stack>
				</Grid.Col>
				<Grid.Col xs={6} md={3}>
					<Stack>
						<Text weight='bold'>Sarunājies</Text>
						<Divider color='indigo' size='sm' />
						<Group>
							<ThemeIcon variant='light'>
								<Mail />
							</ThemeIcon>
							<Anchor href='mailto:info@uoc.lv'>Pasts</Anchor>
						</Group>
						<Group>
							<ThemeIcon color='indigo' variant='light'>
								<BrandDiscord />
							</ThemeIcon>
							<Anchor href='https://discord.gg/hCgp2Gy'>Discord</Anchor>
						</Group>
					</Stack>
				</Grid.Col>
				<Grid.Col xs={6} md={3}>
					<Stack>
						<Text weight='bold'>Lasi</Text>
						<Divider color='indigo' size='sm' />
						<Group>
							<ThemeIcon color='blue' variant='light'>
								<BrandTwitter />
							</ThemeIcon>
							<Anchor href='https://twitter.com/UocLV'>Twitter</Anchor>
						</Group>
						<Group>
							<ThemeIcon color='indigo' variant='light'>
								<BrandFacebook />
							</ThemeIcon>
							<Anchor href='https://www.facebook.com/pages/Uoclv/348883705133824'>Facebook</Anchor>
						</Group>
					</Stack>
				</Grid.Col>
				<Grid.Col xs={6} md={3}>
					<Stack>
						<Text weight='bold'>Skaties</Text>
						<Divider color='indigo' size='sm' />
						<Group>
							<ThemeIcon color='red' variant='light'>
								<BrandYoutube />
							</ThemeIcon>
							<Anchor href='https://www.youtube.com/user/WuuEvil'>Youtube</Anchor>
						</Group>
						<Group>
							<ThemeIcon color='violet' variant='light'>
								<BrandTwitch />
							</ThemeIcon>
							<Anchor href='https://www.twitch.tv/lielaiswuu'>Twitch</Anchor>
						</Group>
					</Stack>
				</Grid.Col>
				<Grid.Col span={12}>
					<Center color=''>
						<Text size='xs' color='gray'>
							©2023 UOC.LV
						</Text>
					</Center>
				</Grid.Col>
			</Grid>
		</Container>
	</Footer>
)

export default FooterPage
