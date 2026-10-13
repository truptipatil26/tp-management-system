import type {
  Application,
  ApplicationStatus,
  CompanyProfile,
  DepartmentCode,
  PlacementDrive,
} from './index'

export interface EligibilityResult {
  eligible: boolean
  reasons: string[] // empty when eligible
}

export interface DriveView extends PlacementDrive {
  companyName: string
}

export interface DriveWithEligibility {
  drive: DriveView
  eligibility: EligibilityResult
  applied: boolean
}

export interface ApplicationView {
  application: Application
  drive: DriveView
}

export interface StudentDashboardData {
  profileCompletion: number // 0-100
  availableDrives: number
  applications: number
  shortlisted: number
  upcomingDeadlines: DriveView[]
  recentDrives: DriveView[]
}

export interface RecentApplication {
  applicationId: string
  studentName: string
  driveTitle: string
  status: ApplicationStatus
  appliedAt: string
}

export interface CompanyDashboardData {
  company: CompanyProfile
  publishedDrives: number
  totalApplicants: number
  shortlisted: number
  upcomingDeadlines: PlacementDrive[]
  recentApplications: RecentApplication[]
}

export interface DepartmentStat {
  department: DepartmentCode
  students: number
  selected: number // students with at least one "selected" application
}

export interface AdminDashboardData {
  totalStudents: number
  totalCompanies: number
  totalDrives: number
  totalApplications: number
  totalShortlisted: number // applications at shortlisted, interview_scheduled or selected
  totalSelected: number
  byDepartment: DepartmentStat[]
  pendingCompanies: CompanyProfile[]
}