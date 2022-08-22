// middleware.ts
import {NextResponse} from 'next/server'

export function middleware(req) {
	const url = req.nextUrl
	console.log({ip: req.ip})
	return NextResponse.rewrite(url)
}
