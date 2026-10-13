import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { ROLE_LABELS, ROLE_PATHS } from '../../lib/roles'
import { initials } from '../../lib/format'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import { NAV, type NavItem } from './navConfig'

const base =
  'inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
const active = 'bg-primary/10 text-primary'
const idle = 'text-muted hover:bg-surface-alt hover:text-text'

export default function TopNav() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const barRef = useRef<HTMLElement>(null)

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) setOpenMenu(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu(null)
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  // Close menus after navigating
  useEffect(() => {
    setOpenMenu(null)
    setMobileOpen(false)
  }, [pathname])

  if (!user) return null

  const home = ROLE_PATHS[user.role]
  const items: NavItem[] = NAV[user.role]

  const handleLogout = async () => {
    navigate('/', { replace: true })
    await logout()
  }

  const groupActive = (item: NavItem) =>
    'children' in item && item.children.some((c) => pathname.startsWith(c.to))

  return (
    <header ref={barRef} className="sticky top-0 z-30 border-b border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Logo to={home} />

        {/* Desktop menu */}
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {items.map((item) =>
            'children' in item ? (
              <div key={item.label} className="relative">
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={openMenu === item.label}
                  onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                  className={`${base} ${groupActive(item) ? active : idle}`}
                >
                  {item.label}
                  <ChevronDown size={14} />
                </button>
                {openMenu === item.label && (
                  <div
                    role="menu"
                    className="absolute left-0 top-full mt-1 min-w-48 rounded-lg border border-border bg-surface p-1 shadow-lg"
                  >
                    {item.children.map((c) => (
                      <NavLink
                        key={c.to}
                        to={c.to}
                        role="menuitem"
                        className={({ isActive }) =>
                          `block rounded-md px-3 py-2 text-sm ${isActive ? active : idle}`
                        }
                      >
                        {c.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === home}
                className={({ isActive }) => `${base} ${isActive ? active : idle}`}
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <div className="flex items-center gap-2" title={`${user.fullName} (${ROLE_LABELS[user.role]})`}>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
              {initials(user.fullName)}
            </span>
            <span className="hidden leading-tight lg:block">
              <span className="block text-sm font-medium">{user.fullName}</span>
              <span className="block text-xs text-muted">{ROLE_LABELS[user.role]}</span>
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Sign out"
            title="Sign out"
            className="rounded-md border border-border p-2 text-muted hover:text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <LogOut size={16} />
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="rounded-md border border-border p-2 md:hidden"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav aria-label="Mobile" className="border-t border-border bg-surface p-3 md:hidden">
          {items.map((item) =>
            'children' in item ? (
              <div key={item.label} className="mb-1">
                <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted">
                  {item.label}
                </p>
                {item.children.map((c) => (
                  <NavLink
                    key={c.to}
                    to={c.to}
                    className={({ isActive }) => `${base} w-full ${isActive ? active : idle}`}
                  >
                    {c.label}
                  </NavLink>
                ))}
              </div>
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === home}
                className={({ isActive }) => `${base} w-full ${isActive ? active : idle}`}
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>
      )}
    </header>
  )
}