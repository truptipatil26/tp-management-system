import type { Role } from '../../types'

export type NavItem =
  | { label: string; to: string }
  | { label: string; children: { label: string; to: string }[] }

export const NAV: Record<Role, NavItem[]> = {
  student: [
    { label: 'Dashboard', to: '/student' },
    {
      label: 'Opportunities',
      children: [
        { label: 'Placement Drives', to: '/student/drives' },
        { label: 'Internships', to: '/student/internships' },
      ],
    },
    { label: 'My Applications', to: '/student/applications' },
    { label: 'Profile', to: '/student/profile' },
  ],
  company: [
    { label: 'Dashboard', to: '/company' },
    {
      label: 'Drives',
      children: [
        { label: 'All Drives', to: '/company/drives' },
        { label: 'Create Drive', to: '/company/drives/new' },
        { label: 'Internships', to: '/company/internships' },
      ],
    },
    { label: 'Applicants', to: '/company/applicants' },
    { label: 'Company Profile', to: '/company/profile' },
  ],
  tp_admin: [
    { label: 'Dashboard', to: '/admin' },
    { label: 'Students', to: '/admin/students' },
    { label: 'Companies', to: '/admin/companies' },
    { label: 'Drives', to: '/admin/drives' },
    { label: 'Placement Records', to: '/admin/records' },
    { label: 'Reports', to: '/admin/reports' },
  ],
}