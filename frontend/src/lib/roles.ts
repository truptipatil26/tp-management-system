import type { Role } from '../types'

export const ROLE_LABELS: Record<Role, string> = {
  student: 'Student',
  company: 'Company',
  tp_admin: 'T&P Admin',
}

/** Where each role lands after login */
export const ROLE_PATHS: Record<Role, string> = {
  student: '/student',
  company: '/company',
  tp_admin: '/admin',
}

export const LOGIN_PATHS: Record<Role, string> = {
  student: '/login/student',
  company: '/login/company',
  tp_admin: '/login/admin',
}

/** URL slug -> role, used by the login page */
export const ROLE_BY_SLUG: Record<string, Role> = {
  student: 'student',
  company: 'company',
  admin: 'tp_admin',
}