import { Outlet } from 'react-router-dom'
import TopNav from './TopNav'

export default function AppShell() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-surface px-4 py-3 text-center text-sm text-muted">
        © {new Date().getFullYear()} T&amp;P Portal — student project prototype. Fictional data only.
      </footer>
    </div>
  )
}