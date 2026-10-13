import type { PlacementDrive, StudentProfile } from '../types'
import type { EligibilityResult } from '../types/views'

export interface EligibilityContext {
  companyApproved: boolean
  alreadyApplied: boolean
  now?: Date
}

export function checkEligibility(
  student: StudentProfile,
  drive: PlacementDrive,
  ctx: EligibilityContext,
): EligibilityResult {
  const reasons: string[] = []
  const now = ctx.now ?? new Date()

  if (drive.status !== 'published') reasons.push('This drive is not open for applications.')
  if (!ctx.companyApproved) reasons.push('The company is not approved.')
  if (new Date(drive.deadline) < now) reasons.push('The application deadline has passed.')
  if (student.cgpa < drive.minCgpa)
    reasons.push(`Minimum CGPA ${drive.minCgpa} required (yours: ${student.cgpa.toFixed(2)}).`)
  if (student.activeBacklogs > drive.maxBacklogs)
    reasons.push(`At most ${drive.maxBacklogs} active backlog(s) allowed.`)
  if (!drive.eligibleDepartments.includes(student.department))
    reasons.push(`Open to ${drive.eligibleDepartments.join(', ')} only.`)
  if (ctx.alreadyApplied) reasons.push('You have already applied to this drive.')

  return { eligible: reasons.length === 0, reasons }
}