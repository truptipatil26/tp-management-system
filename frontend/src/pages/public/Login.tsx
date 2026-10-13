import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Logo from '../../components/layout/Logo'
import ThemeToggle from '../../components/layout/ThemeToggle'
import { useAuth } from '../../context/AuthContext'
import { ROLE_BY_SLUG, ROLE_LABELS, ROLE_PATHS } from '../../lib/roles'
import { isMockMode } from '../../services'
import { resetDB } from '../../mocks/store'
import { DEMO_PASSWORD } from '../../mocks/seed'
import type { Role } from '../../types'

const DEMO_EMAILS: Record<Role, string> = {
  student: 'aarav.patil@student.example.edu',
  company: 'hr@nimbus.example.com',
  tp_admin: 'tp.admin@example.edu',
}

const inputCls =
  'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'

export default function Login() {
  const { role: slug } = useParams()
  const role = slug ? ROLE_BY_SLUG[slug] : undefined
  const { user, login, logout } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!role) return <Navigate to="/" replace />

  if (user && user.role === role) {
    const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname
    const target = from && from.startsWith(ROLE_PATHS[role]) ? from : ROLE_PATHS[role]
    return <Navigate to={target} replace />
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address.')
      return
    }
    if (!password) {
      setError('Enter your password.')
      return
    }
    setSubmitting(true)
    try {
      const profile = await login(email, password)
      if (profile.role !== role) {
        await logout()
        setError(`This account is not a ${ROLE_LABELS[role]} account.`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 sm:px-6">
        <Logo />
        <ThemeToggle />
      </header>
      <main className="mx-auto max-w-md p-4 sm:p-6">
        <div className="mt-6 rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h1 className="text-xl font-semibold">{ROLE_LABELS[role]} Login</h1>
          <form onSubmit={onSubmit} noValidate className="mt-4 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
              <input id="email" type="email" autoComplete="username" value={email}
                onChange={(e) => setEmail(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
              <input id="password" type="password" autoComplete="current-password" value={password}
                onChange={(e) => setPassword(e.target.value)} className={inputCls} />
            </div>
            {error && (
              <p role="alert" className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
                {error}
              </p>
            )}
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          {isMockMode && (
            <div className="mt-5 rounded-lg border border-border bg-surface-alt p-3 text-sm">
              <p className="font-medium">Demo mode (fictional data)</p>
              <p className="mt-1 text-muted">
                {DEMO_EMAILS[role]} / {DEMO_PASSWORD}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button type="button" variant="secondary"
                  onClick={() => { setEmail(DEMO_EMAILS[role]); setPassword(DEMO_PASSWORD) }}>
                  Fill demo login
                </Button>
                <Button type="button" variant="secondary"
                  onClick={() => { resetDB(); window.location.reload() }}>
                  Reset demo data
                </Button>
              </div>
            </div>
          )}
        </div>
        <p className="mt-4 text-center text-sm text-muted">
          <Link to="/" className="text-primary hover:underline">← Back to home</Link>
        </p>
      </main>
    </div>
  )
}