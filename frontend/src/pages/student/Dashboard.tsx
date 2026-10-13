import { Briefcase, ClipboardList, Star, UserCheck } from 'lucide-react'
import Card from '../../components/ui/Card'
import DeadlineBadge from '../../components/ui/DeadlineBadge'
import StatCard from '../../components/ui/StatCard'
import { EmptyState, ErrorBlock, Spinner } from '../../components/ui/Feedback'
import { useAuth } from '../../context/AuthContext'
import { useAsync } from '../../hooks/useAsync'
import { formatDate } from '../../lib/format'
import { api } from '../../services'
import type { DriveView } from '../../types/views'

function DriveRow({ drive, showDeadline }: { drive: DriveView; showDeadline?: boolean }) {
  return (
    <li className="flex items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="truncate font-medium text-primary">{drive.title}</p>
        <p className="truncate text-sm text-muted">
          {drive.companyName} · {drive.opportunityType === 'internship' ? 'Internship' : 'Placement'} ·
          Ends {formatDate(drive.deadline)}
        </p>
      </div>
      {showDeadline && <DeadlineBadge deadline={drive.deadline} />}
    </li>
  )
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const { data, error, loading, reload } = useAsync(() => api.getStudentDashboard())

  if (loading && !data) return <Spinner />
  if (error || !data) return <ErrorBlock message={error ?? 'No data.'} onRetry={reload} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome, {user?.fullName.split(' ')[0]}</h1>
        <p className="text-muted">Your placement overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={UserCheck} label="Profile completion" value={`${data.profileCompletion}%`} />
        <StatCard icon={Briefcase} label="Open drives" value={data.availableDrives} />
        <StatCard icon={ClipboardList} label="Applications" value={data.applications} />
        <StatCard icon={Star} label="Shortlisted" value={data.shortlisted} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Upcoming deadlines" onRefresh={reload}>
          {data.upcomingDeadlines.length === 0 ? (
            <EmptyState title="No open deadlines" message="New drives will appear here." />
          ) : (
            <ul className="divide-y divide-border">
              {data.upcomingDeadlines.map((d) => <DriveRow key={d.id} drive={d} showDeadline />)}
            </ul>
          )}
        </Card>
        <Card title="Recent opportunities" onRefresh={reload}>
          {data.recentDrives.length === 0 ? (
            <EmptyState title="Nothing yet" message="Published drives will appear here." />
          ) : (
            <ul className="divide-y divide-border">
              {data.recentDrives.map((d) => <DriveRow key={d.id} drive={d} />)}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}