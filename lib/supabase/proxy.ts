import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data } = await supabase.auth.getClaims()
  const isLoggedIn = !!data?.claims
  const isLoginPage = request.nextUrl.pathname.startsWith('/login')

  let redirectTo: string | null = null
  if (!isLoggedIn && !isLoginPage) redirectTo = '/login'
  if (isLoggedIn && isLoginPage) redirectTo = '/'

  if (redirectTo) {
    const url = request.nextUrl.clone()
    url.pathname = redirectTo
    const redirect = NextResponse.redirect(url)
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c))
    return redirect
  }

  return response
}