import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LOGIN_PATHS, ROLE_PATHS } from '../lib/roles'
import type { Role } from '../types'
import { Spinner } from '../components/ui/Feedback'

export default function ProtectedRoute({ role }: { role: Role }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Spinner />
      </div>
    )
  }
  if (!user) {
    return <Navigate to={LOGIN_PATHS[role]} state={{ from: location }} replace />
  }
  if (user.role !== role) {
    // Logged in, but trying to open another role's area: send them home
    return <Navigate to={ROLE_PATHS[user.role]} replace />
  }
  return <Outlet />
}