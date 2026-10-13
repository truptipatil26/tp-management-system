import { ApiError, type Api } from './api'
import {
  getDB,
  getSessionUserId,
  newId,
  saveDB,
  setSessionUserId,
} from '../mocks/store'
import { checkEligibility } from '../lib/eligibility'
import { DEPARTMENTS } from '../types'
import type {
  Application,
  ApplicationStatus,
  PlacementDrive,
  Profile,
  Role,
  StudentProfile,
} from '../types'
import type { DriveView } from '../types/views'

const delay = (ms = 200) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/** Copy results, like a real network response would be: the UI can't mutate our store. */
const clone = <T>(value: T): T => structuredClone(value)

const SHORTLIST_STAGE: ApplicationStatus[] = ['shortlisted', 'interview_scheduled', 'selected']

function currentUser(): Profile | null {
  const id = getSessionUserId()
  if (!id) return null
  return getDB().profiles.find((p) => p.id === id && p.isActive) ?? null
}

/** Mirrors backend role guards: 401 if not signed in, 403 if wrong role. */
function requireRole(role: Role): Profile {
  const user = currentUser()
  if (!user) throw new ApiError('You are not signed in.', 401)
  if (user.role !== role) throw new ApiError('You do not have permission to do this.', 403)
  return user
}

function getStudent(userId: string): StudentProfile {
  const sp = getDB().students.find((s) => s.userId === userId)
  if (!sp) throw new ApiError('Student profile not found.', 404)
  return sp
}

function toDriveView(d: PlacementDrive): DriveView {
  const company = getDB().companies.find((c) => c.userId === d.companyId)
  return { ...d, companyName: company?.name ?? 'Unknown company' }
}

function isCompanyApproved(companyId: string): boolean {
  return getDB().companies.find((c) => c.userId === companyId)?.status === 'approved'
}

function isOpen(d: PlacementDrive): boolean {
  return d.status === 'published' && new Date(d.deadline) > new Date() && isCompanyApproved(d.companyId)
}

function profileCompletion(sp: StudentProfile): number {
  const checks = [
    !!sp.phone,
    !!sp.resumeSummary,
    sp.skills.length > 0,
    sp.projects.length > 0,
    sp.experiences.length > 0,
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

export const mockApi: Api = {
  // ---------- auth ----------
  async login(email, password) {
    await delay()
    const db = getDB()
    const profile = db.profiles.find(
      (p) => p.email.toLowerCase() === email.trim().toLowerCase(),
    )
    // Same message for "no such user" and "wrong password": don't reveal which emails exist.
    if (!profile || !profile.isActive || db.passwords[profile.id] !== password) {
      throw new ApiError('Invalid email or password.', 401)
    }
    setSessionUserId(profile.id)
    return clone(profile)
  },

  async logout() {
    await delay(50)
    setSessionUserId(null)
  },

  async getCurrentUser() {
    await delay(50)
    return clone(currentUser())
  },

  // ---------- student ----------
  async getStudentDashboard() {
    await delay()
    const user = requireRole('student')
    const db = getDB()
    const sp = getStudent(user.id)

    const mine = db.applications.filter((a) => a.studentId === user.id)
    const open = db.drives.filter(isOpen)

    return clone({
      profileCompletion: profileCompletion(sp),
      availableDrives: open.length,
      applications: mine.length,
      shortlisted: mine.filter((a) => SHORTLIST_STAGE.includes(a.status)).length,
      upcomingDeadlines: [...open]
        .sort((a, b) => a.deadline.localeCompare(b.deadline))
        .slice(0, 4)
        .map(toDriveView),
      recentDrives: [...open]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 4)
        .map(toDriveView),
    })
  },

  async listDrives() {
    await delay()
    const user = requireRole('student')
    const db = getDB()
    const sp = getStudent(user.id)
    const applied = new Set(
      db.applications.filter((a) => a.studentId === user.id).map((a) => a.driveId),
    )
    return clone(
      db.drives
        .filter((d) => d.status === 'published')
        .map((d) => ({
          drive: toDriveView(d),
          applied: applied.has(d.id),
          eligibility: checkEligibility(sp, d, {
            companyApproved: isCompanyApproved(d.companyId),
            alreadyApplied: applied.has(d.id),
          }),
        })),
    )
  },

  async applyToDrive(driveId) {
    await delay()
    const user = requireRole('student')
    const db = getDB()
    const sp = getStudent(user.id)

    const drive = db.drives.find((d) => d.id === driveId)
    if (!drive || drive.status !== 'published') throw new ApiError('Drive not found.', 404)

    const alreadyApplied = db.applications.some(
      (a) => a.driveId === driveId && a.studentId === user.id,
    )
    const result = checkEligibility(sp, drive, {
      companyApproved: isCompanyApproved(drive.companyId),
      alreadyApplied,
    })
    if (!result.eligible) {
      throw new ApiError(result.reasons.join(' '), alreadyApplied ? 409 : 422)
    }

    const now = new Date().toISOString()
    const application: Application = {
      id: newId('app'),
      driveId,
      studentId: user.id,
      status: 'applied',
      appliedAt: now,
      updatedAt: now,
    }
    db.applications.push(application)
    db.history.push({
      id: newId('hist'),
      applicationId: application.id,
      fromStatus: null,
      toStatus: 'applied',
      changedBy: user.id,
      changedAt: now,
    })
    saveDB()
    return clone(application)
  },

  async listMyApplications() {
    await delay()
    const user = requireRole('student')
    const db = getDB()
    return clone(
      db.applications
        .filter((a) => a.studentId === user.id)
        .sort((a, b) => b.appliedAt.localeCompare(a.appliedAt))
        .flatMap((application) => {
          const drive = db.drives.find((d) => d.id === application.driveId)
          return drive ? [{ application, drive: toDriveView(drive) }] : []
        }),
    )
  },

  // ---------- company ----------
  async getCompanyDashboard() {
    await delay()
    const user = requireRole('company')
    const db = getDB()
    const company = db.companies.find((c) => c.userId === user.id)
    if (!company) throw new ApiError('Company profile not found.', 404)

    const myDrives = db.drives.filter((d) => d.companyId === user.id)
    const myDriveIds = new Set(myDrives.map((d) => d.id))
    const apps = db.applications.filter((a) => myDriveIds.has(a.driveId))

    return clone({
      company,
      publishedDrives: myDrives.filter((d) => d.status === 'published').length,
      totalApplicants: apps.length,
      shortlisted: apps.filter((a) => SHORTLIST_STAGE.includes(a.status)).length,
      upcomingDeadlines: myDrives
        .filter((d) => d.status === 'published' && new Date(d.deadline) > new Date())
        .sort((a, b) => a.deadline.localeCompare(b.deadline))
        .slice(0, 4),
      recentApplications: [...apps]
        .sort((a, b) => b.appliedAt.localeCompare(a.appliedAt))
        .slice(0, 5)
        .map((a) => ({
          applicationId: a.id,
          studentName: db.profiles.find((p) => p.id === a.studentId)?.fullName ?? 'Unknown',
          driveTitle: myDrives.find((d) => d.id === a.driveId)?.title ?? 'Unknown',
          status: a.status,
          appliedAt: a.appliedAt,
        })),
    })
  },

  // ---------- admin ----------
  async getAdminDashboard() {
    await delay()
    requireRole('tp_admin')
    const db = getDB()

    const selectedStudentIds = new Set(
      db.applications.filter((a) => a.status === 'selected').map((a) => a.studentId),
    )

    return clone({
      totalStudents: db.students.length,
      totalCompanies: db.companies.length,
      totalDrives: db.drives.length,
      totalApplications: db.applications.length,
      totalShortlisted: db.applications.filter((a) => SHORTLIST_STAGE.includes(a.status)).length,
      totalSelected: db.applications.filter((a) => a.status === 'selected').length,
      byDepartment: DEPARTMENTS.map((d) => {
        const ids = db.students.filter((s) => s.department === d.code).map((s) => s.userId)
        return {
          department: d.code,
          students: ids.length,
          selected: ids.filter((id) => selectedStudentIds.has(id)).length,
        }
      }),
      pendingCompanies: db.companies.filter((c) => c.status === 'pending'),
    })
  },

  async setCompanyStatus(companyId, status, reason) {
    await delay()
    requireRole('tp_admin')
    const db = getDB()
    const company = db.companies.find((c) => c.userId === companyId)
    if (!company) throw new ApiError('Company not found.', 404)

    company.status = status
    company.rejectionReason = status === 'rejected' ? reason : undefined
    saveDB()
    return clone(company)
  },
}