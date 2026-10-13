import { Briefcase, Star, Users } from 'lucide-react'
import Card from '../../components/ui/Card'
import DeadlineBadge from '../../components/ui/DeadlineBadge'
import { StatusBadge } from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import { EmptyState, ErrorBlock, Spinner } from '../../components/ui/Feedback'
import { useAsync } from '../../hooks/useAsync'
import { formatDate } from '../../lib/format'
import { api } from '../../services'

const STATUS_MESSAGES: Record<string, string> = {
  pending: 'Your registration is waiting for T&P approval. You can prepare drafts, but you cannot publish drives yet.',
  rejected: 'Your registration was rejected by the T&P department.',
  suspended: 'Your account is suspended. Contact the T&P department.',
}

export default function CompanyDashboard() {
  const { data, error, loading, reload } = useAsync(() => api.getCompanyDashboard())

  if (loading && !data) return <Spinner />
  if (error || !data) return <ErrorBlock message={error ?? 'No data.'} onRetry={reload} />

  const { company } = data

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold">{company.name}</h1>
        <StatusBadge status={company.status} />
      </div>

      {company.status !== 'approved' && (
        <div role="status" className="rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm text-warning">
          {STATUS_MESSAGES[company.status]}
          {company.rejectionReason && ` Reason: ${company.rejectionReason}`}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Briefcase} label="Published drives" value={data.publishedDrives} />
        <StatCard icon={Users} label="Total applicants" value={data.totalApplicants} />
        <StatCard icon={Star} label="Shortlisted" value={data.shortlisted} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Upcoming deadlines" onRefresh={reload}>
          {data.upcomingDeadlines.length === 0 ? (
            <EmptyState title="No open drives" message="Publish a drive to see its deadline here." />
          ) : (
            <ul className="divide-y divide-border">
              {data.upcomingDeadlines.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-medium text-primary">{d.title}</p>
                    <p className="text-sm text-muted">Ends {formatDate(d.deadline)}</p>
                  </div>
                  <DeadlineBadge deadline={d.deadline} />
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Recent applications" onRefresh={reload}>
          {data.recentApplications.length === 0 ? (
            <EmptyState title="No applications yet" message="Student applications will appear here." />
          ) : (
            <ul className="divide-y divide-border">
              {data.recentApplications.map((a) => (
                <li key={a.applicationId} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-medium">{a.studentName}</p>
                    <p className="text-sm text-muted">{a.driveTitle} · {formatDate(a.appliedAt)}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}