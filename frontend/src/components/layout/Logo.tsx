import { GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Logo({ to = '/' }: { to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-2 font-semibold">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-contrast">
        <GraduationCap size={18} />
      </span>
      <span>T&amp;P Portal</span>
    </Link>
  )
}