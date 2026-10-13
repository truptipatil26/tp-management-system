import { Building2, GraduationCap, ShieldCheck, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from '../../components/layout/Logo'
import ThemeToggle from '../../components/layout/ThemeToggle'
import { LOGIN_PATHS } from '../../lib/roles'
import type { Role } from '../../types'

const PORTALS: { role: Role; title: string; text: string; Icon: LucideIcon }[] = [
  { role: 'student', title: 'Student Login', text: 'Browse drives, check eligibility, apply and track applications.', Icon: GraduationCap },
  { role: 'company', title: 'Company Login', text: 'Publish drives, review applicants and shortlist candidates.', Icon: Building2 },
  { role: 'tp_admin', title: 'T&P Login', text: 'Approve companies, monitor recruitment and view reports.', Icon: ShieldCheck },
]

export default function Landing() {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 sm:px-6">
        <Logo />
        <ThemeToggle />
      </header>
      <main className="mx-auto max-w-5xl p-4 sm:p-6">
        <section className="py-10 text-center">
          <h1 className="text-3xl font-semibold sm:text-4xl">Training &amp; Placement Management</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted">
            One place where students, recruiters and the college T&amp;P department work together.
          </p>
        </section>
        <div className="grid gap-4 sm:grid-cols-3">
          {PORTALS.map(({ role, title, text, Icon }) => (
            <Link
              key={role}
              to={LOGIN_PATHS[role]}
              className="rounded-xl border border-border bg-surface p-5 shadow-sm transition hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Icon className="mb-3 text-primary" size={28} />
              <h2 className="font-medium">{title}</h2>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}