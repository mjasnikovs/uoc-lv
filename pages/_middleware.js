import {NextResponse} from 'next/server'

export function middleware(req) {
	const allowedIps = ['127.0.0.1', '1.2.3.4']
	const ip = req.headers['x-forwarded-for'] || req.ip

	console.log('ip: ' + ip)
	if (ip === undefined) {
		// for the dev environment
		return NextResponse.next()
	}

	if (!allowedIps.includes(ip)) {
		const url = req.nextUrl.clone()
		if (url.pathname.startsWith('/favicon') || url.pathname.startsWith('/img')) {
			return NextResponse.next()
		}
		url.pathname = '/coming-soon'
		const res = NextResponse.rewrite(url)
		return res
	}
	return NextResponse.next()
}
