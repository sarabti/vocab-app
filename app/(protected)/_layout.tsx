// app/(protected)/layout.tsx
import { requireUser } from '@/lib/auth'
import { logout } from '@/lib/actions/auth.actions'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireUser()

  return (
    <div>
      <header>
        <span>{user.email}</span>
        <form action={logout}>
          <button type="submit">Log out</button>
        </form>
      </header>
      <main>{children}</main>
    </div>
  )
}