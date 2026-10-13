import { Link, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import ProtectedRoute from './app/ProtectedRoute'
import Landing from './pages/public/Landing'
import Login from './pages/public/Login'
import ComingSoon from './pages/ComingSoon'
import StudentDashboard from './pages/student/Dashboard'
import CompanyDashboard from './pages/company/Dashboard'
import AdminDashboard from './pages/admin/Dashboard'

function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <Link to="/" className="mt-2 inline-block text-primary hover:underline">Go home</Link>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login/:role" element={<Login />} />

      <Route element={<ProtectedRoute role="student" />}>
        <Route element={<AppShell />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/*" element={<ComingSoon />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="company" />}>
        <Route element={<AppShell />}>
          <Route path="/company" element={<CompanyDashboard />} />
          <Route path="/company/*" element={<ComingSoon />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="tp_admin" />}>
        <Route element={<AppShell />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/*" element={<ComingSoon />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}