// ===== Shared contract: mirrors database/migrations. Owner: Member 4 =====

export const DEPARTMENTS = [
  { code: 'MECH', name: 'Mechanical Engineering' },
  { code: 'CIVIL', name: 'Civil Engineering' },
  { code: 'EXTC', name: 'Electronics & Telecommunication' },
  { code: 'IT', name: 'Information Technology' },
  { code: 'CSE', name: 'Computer Science & Engineering' },
  { code: 'AIDS', name: 'Artificial Intelligence & Data Science' },
  { code: 'IOT', name: 'Internet of Things' },
] as const

export type DepartmentCode = (typeof DEPARTMENTS)[number]['code']

export type Role = 'student' | 'company' | 'tp_admin'

export type CompanyStatus = 'pending' | 'approved' | 'rejected' | 'suspended'

export type OpportunityType = 'placement' | 'internship'

export type DriveStatus =
  | 'draft'
  | 'pending_approval'
  | 'published'
  | 'closed'
  | 'archived'
  | 'rejected'

export type ApplicationStatus =
  | 'applied'
  | 'under_review'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'selected'
  | 'rejected'
  | 'withdrawn'

/** Allowed status changes. The backend enforces this; the UI uses it to show valid buttons. */
export const ALLOWED_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  applied: ['under_review', 'shortlisted', 'rejected', 'withdrawn'],
  under_review: ['shortlisted', 'rejected', 'withdrawn'],
  shortlisted: ['interview_scheduled', 'selected', 'rejected', 'withdrawn'],
  interview_scheduled: ['interview_scheduled', 'selected', 'rejected', 'withdrawn'],
  selected: [],
  rejected: [],
  withdrawn: [],
}

export interface Profile {
  id: string
  role: Role
  fullName: string
  email: string
  isActive: boolean
}

export interface StudentProfile {
  userId: string
  prn: string
  department: DepartmentCode
  batchYear: number // graduation year, e.g. 2027
  currentYear: 1 | 2 | 3 | 4
  cgpa: number // 0 - 10
  activeBacklogs: number
  phone?: string
  resumeSummary?: string
  skills: string[]
  projects: StudentProject[]
  experiences: StudentExperience[]
}

export interface StudentProject {
  id: string
  title: string
  description: string
  techStack: string[]
  link?: string
}

export interface StudentExperience {
  id: string
  organization: string
  role: string
  startDate: string // ISO date
  endDate?: string
  description?: string
}

export interface CompanyProfile {
  userId: string
  name: string
  industry: string
  website?: string
  description: string
  contactPerson: string
  contactEmail: string
  status: CompanyStatus
  rejectionReason?: string
}

export interface PlacementDrive {
  id: string
  companyId: string
  opportunityType: OpportunityType
  title: string
  description: string
  location: string
  employmentType: 'full_time' | 'part_time' | 'internship' | 'contract'
  packageLpa?: number // placements
  stipendPerMonth?: number // internships
  minCgpa: number
  maxBacklogs: number
  eligibleDepartments: DepartmentCode[]
  requiredSkills: string[]
  deadline: string // ISO datetime
  status: DriveStatus
  createdAt: string
}

export interface Application {
  id: string
  driveId: string
  studentId: string
  status: ApplicationStatus
  appliedAt: string
  updatedAt: string
  finalPackageLpa?: number
  remarks?: string
}

export interface ApplicationStatusHistory {
  id: string
  applicationId: string
  fromStatus: ApplicationStatus | null
  toStatus: ApplicationStatus
  changedBy: string
  interviewRound?: string
  scheduledAt?: string
  note?: string
  changedAt: string
}