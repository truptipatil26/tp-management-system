import { useState } from 'react'
import { Briefcase, Building2, ClipboardList, GraduationCap, Star, Trophy } from 'lucide-react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import { EmptyState, ErrorBlock, Spinner } from '../../components/ui/Feedback'
import { useAsync } from '../../hooks/useAsync'
import { api } from '../../services'
import type { CompanyProfile } from '../../types'

export default function AdminDashboard() {
  const { data, error, loading, reload } = useAsync(() => api.getAdminDashboard())
  const [busyId, setBusyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  if (loading && !data) return <Spinner />
  if (error || !data) return <ErrorBlock message={error ?? 'No data.'} onRetry={reload} />

  const decide = async (company: CompanyProfile, status: 'approved' | 'rejected') => {
    const verb = status === 'approved' ? 'Approve' : 'Reject'
    if (!window.confirm(`${verb} ${company.name}?`)) return
    setBusyId(company.userId)
    setActionError(null)
    try {
      await api.setCompanyStatus(
        company.userId,
        status,
        status === 'rejected' ? 'Rejected by T&P (demo)' : undefined,
      )
      reload()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Action failed.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">T&amp;P Overview</h1>
        <p className="text-muted">Live numbers calculated from the prototype records.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={GraduationCap} label="Registered students" value={data.totalStudents} />
        <StatCard icon={Building2} label="Registered companies" value={data.totalCompanies} />
        <StatCard icon={Briefcase} label="Placement drives" value={data.totalDrives} />
        <StatCard icon={ClipboardList} label="Applications" value={data.totalApplications} />
        <StatCard icon={Star} label="Shortlisted (incl. later stages)" value={data.totalShortlisted} />
        <StatCard icon={Trophy} label="Selected" value={data.totalSelected} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Department-wise statistics" onRefresh={reload}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-primary text-muted">
                  <th className="py-2 pr-3 font-medium">Department</th>
                  <th className="py-2 pr-3 font-medium">Students</th>
                  <th className="py-2 font-medium">Placed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.byDepartment.map((d) => (
                  <tr key={d.department}>
                    <td className="py-2 pr-3 font-medium">{d.department}</td>
                    <td className="py-2 pr-3">{d.students}</td>
                    <td className="py-2">{d.selected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Pending company approvals" onRefresh={reload}>
          {actionError && (
            <p role="alert" className="mb-3 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
              {actionError}
            </p>
          )}
          {data.pendingCompanies.length === 0 ? (
            <EmptyState title="All caught up" message="No companies are waiting for review." />
          ) : (
            <ul className="divide-y divide-border">
              {data.pendingCompanies.map((c) => (
                <li key={c.userId} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-sm text-muted">{c.industry} · {c.contactEmail}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button disabled={busyId === c.userId} onClick={() => decide(c, 'approved')}>Approve</Button>
                    <Button variant="danger" disabled={busyId === c.userId} onClick={() => decide(c, 'rejected')}>Reject</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}