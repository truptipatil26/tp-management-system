import { GraduationCap, Users, Briefcase, ClipboardCheck } from 'lucide-react'
import ThemeToggle from './components/layout/ThemeToggle'
import { DEPARTMENTS } from './types'

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <GraduationCap className="text-primary" />
          T&amp;P Portal
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
        <h1 className="text-2xl font-semibold">Setup check</h1>
        <p className="text-muted">
          If you can switch between Light, Dark and System, and the colours
          change everywhere, Phase 0 works.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Students', value: '0', Icon: Users },
            { label: 'Drives', value: '0', Icon: Briefcase },
            { label: 'Applications', value: '0', Icon: ClipboardCheck },
          ].map(({ label, value, Icon }) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-surface p-5 shadow-sm"
            >
              <Icon className="mb-3 text-primary" />
              <p className="text-sm text-muted">{label}</p>
              <p className="text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-3 font-medium">Departments from shared types</h2>
          <div className="flex flex-wrap gap-2">
            {DEPARTMENTS.map((d) => (
              <span
                key={d.code}
                title={d.name}
                className="rounded-full border border-border bg-surface-alt px-3 py-1 text-sm"
              >
                {d.code}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}