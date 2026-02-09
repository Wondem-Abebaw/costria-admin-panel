import { NextResponse, NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/auth/signin', request.url))
}
 


export const config = {
  matcher: ["/","/vehicles/:path*", "/events/:path*", "/commercial/:path*","/residential/:path*", "/construction/:path*","/users/:path*", "/admins/:path*"],
}