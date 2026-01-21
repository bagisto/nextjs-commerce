import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    const restrictedPaths = ['/customer/login', '/customer/register']

    if (restrictedPaths.some((path) => pathname.startsWith(path))) {
        const token = await getToken({
            req: request,
            secret: process.env.NEXT_PUBLIC_NEXT_AUTH_SECRET
        })

        if (token) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/customer/login', '/customer/register'],
}
