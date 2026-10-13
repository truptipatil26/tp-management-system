import type { Application, CompanyProfile, Profile } from '../types'
import type {
  AdminDashboardData,
  ApplicationView,
  CompanyDashboardData,
  DriveWithEligibility,
  StudentDashboardData,
} from '../types/views'

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export interface Api {
  // ---- auth ----
  login(email: string, password: string): Promise<Profile>
  logout(): Promise<void>
  getCurrentUser(): Promise<Profile | null>

  // ---- student (current user must be a student) ----
  getStudentDashboard(): Promise<StudentDashboardData>
  listDrives(): Promise<DriveWithEligibility[]>
  applyToDrive(driveId: string): Promise<Application>
  listMyApplications(): Promise<ApplicationView[]>

  // ---- company (current user must be a company) ----
  getCompanyDashboard(): Promise<CompanyDashboardData>

  // ---- T&P admin (current user must be tp_admin) ----
  getAdminDashboard(): Promise<AdminDashboardData>
  setCompanyStatus(
    companyId: string,
    status: 'approved' | 'rejected' | 'suspended',
    reason?: string,
  ): Promise<CompanyProfile>
}