import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
}

export default function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <Icon className="mb-3 text-primary" size={28} />
      <p className="text-sm text-muted">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  )
}