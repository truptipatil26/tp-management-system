import { Construction } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { EmptyState } from '../components/ui/Feedback'
import Card from '../components/ui/Card'

const OWNERS: Record<string, string> = {
  '/student': 'Member 1',
  '/company': 'Member 2',
  '/admin': 'Member 3',
}

export default function ComingSoon() {
  const { pathname } = useLocation()
  const owner = Object.entries(OWNERS).find(([prefix]) => pathname.startsWith(prefix))?.[1]
  return (
    <Card>
      <EmptyState
        icon={Construction}
        title="This page is not built yet"
        message={`${pathname} is assigned to ${owner ?? 'the team'}.`}
      />
    </Card>
  )
}