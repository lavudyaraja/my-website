import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Admin route protection
    if (pathname.startsWith("/admin")) {
      // In a real app, you'd check the user's role from the database
      // For now, we'll just check if the user is authenticated
      if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
      }
    }

    // Dashboard route protection
    if (pathname.startsWith("/dashboard")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}