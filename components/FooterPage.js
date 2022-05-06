import {Footer, Text, Container, Anchor, Grid, Group, ThemeIcon, Divider, Stack, Center} from '@mantine/core'

import {BrandTwitter, BrandFacebook, BrandYoutube, BrandTwitch, Mail, BrandDiscord} from 'tabler-icons-react'

const FooterPage = () => (
	<Footer height={60} p='md'>
		<Container size='xl'>
			<Grid>
				<Grid.Col xs={6} md={3}>
					<Stack>
						<Text weight='bold'>Kategorijas</Text>
						<Divider color='indigo' size='sm' />
						<Anchor href='https://mantine.dev/'>Sākums</Anchor>
						<Anchor href='https://mantine.dev/'>Arhīvs</Anchor>
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
							<Anchor href='https://mantine.dev/'>Pasts</Anchor>
						</Group>
						<Group>
							<ThemeIcon color='indigo' variant='light'>
								<BrandDiscord />
							</ThemeIcon>
							<Anchor href='https://mantine.dev/'>Discord</Anchor>
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
							<Anchor href='https://mantine.dev/'>Twitter</Anchor>
						</Group>
						<Group>
							<ThemeIcon color='indigo' variant='light'>
								<BrandFacebook />
							</ThemeIcon>
							<Anchor href='https://mantine.dev/'>Facebook</Anchor>
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
							<Anchor href='https://mantine.dev/'>Youtube</Anchor>
						</Group>
						<Group>
							<ThemeIcon color='violet' variant='light'>
								<BrandTwitch />
							</ThemeIcon>
							<Anchor href='https://mantine.dev/'>Twitch</Anchor>
						</Group>
					</Stack>
				</Grid.Col>
				<Grid.Col span={12}>
					<Center color=''>
						<Text size='xs' color='gray'>
							©2020 UOC.LV
						</Text>
					</Center>
				</Grid.Col>
			</Grid>
		</Container>
	</Footer>
)

export default FooterPage
