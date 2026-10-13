import type {
  Application,
  ApplicationStatus,
  ApplicationStatusHistory,
  CompanyProfile,
  DepartmentCode,
  DriveStatus,
  OpportunityType,
  PlacementDrive,
  Profile,
  StudentProfile,
} from '../types'
import { checkEligibility } from '../lib/eligibility'

export interface MockDB {
  version: number
  profiles: Profile[]
  passwords: Record<string, string> // userId -> password (MOCK ONLY)
  students: StudentProfile[]
  companies: CompanyProfile[]
  drives: PlacementDrive[]
  applications: Application[]
  history: ApplicationStatusHistory[]
}

/** Bump this number whenever the seed shape changes: stored data is then rebuilt. */
export const DB_VERSION = 1
export const DEMO_PASSWORD = 'demo123'

const DAY = 86_400_000
const daysFromNow = (n: number) => new Date(Date.now() + n * DAY).toISOString()

// ---------- Students (20 fictional) ----------
type RawStudent = [
  name: string,
  dept: DepartmentCode,
  cgpa: number,
  backlogs: number,
  skills: string[],
]

const RAW_STUDENTS: RawStudent[] = [
  ['Aarav Patil', 'CSE', 8.9, 0, ['React', 'Python', 'SQL']],
  ['Diya Sharma', 'IT', 8.2, 0, ['Java', 'Spring', 'SQL']],
  ['Rohan Deshmukh', 'MECH', 7.4, 0, ['AutoCAD', 'SolidWorks']],
  ['Sneha Kulkarni', 'EXTC', 8.0, 0, ['Embedded C', 'VLSI', 'MATLAB']],
  ['Kabir Joshi', 'CIVIL', 7.1, 1, ['AutoCAD', 'STAAD Pro']],
  ['Ananya Rao', 'AIDS', 9.1, 0, ['Python', 'Machine Learning', 'TensorFlow']],
  ['Vihaan Gupta', 'IOT', 7.8, 0, ['Arduino', 'MQTT', 'Python']],
  ['Ishita Mehta', 'CSE', 6.9, 1, ['Java', 'HTML', 'CSS']],
  ['Arjun Nair', 'IT', 7.6, 0, ['JavaScript', 'Node.js', 'MongoDB']],
  ['Meera Iyer', 'AIDS', 8.5, 0, ['Python', 'Pandas', 'SQL']],
  ['Yash Pawar', 'MECH', 6.5, 2, ['SolidWorks', 'ANSYS']],
  ['Tanvi Bhosale', 'EXTC', 8.7, 0, ['IoT', 'Embedded C', 'Python']],
  ['Aditya Singh', 'CSE', 8.1, 0, ['C++', 'DSA', 'SQL']],
  ['Riya Chavan', 'CIVIL', 8.3, 0, ['Revit', 'AutoCAD']],
  ['Omkar Jadhav', 'IOT', 7.2, 0, ['ESP32', 'C', 'MQTT']],
  ['Nisha Verma', 'IT', 9.0, 0, ['React', 'TypeScript', 'SQL']],
  ['Harsh Thakur', 'MECH', 7.9, 0, ['CATIA', 'AutoCAD']],
  ['Pooja Salvi', 'AIDS', 7.0, 1, ['Python', 'Statistics']],
  ['Siddharth More', 'CSE', 7.7, 0, ['Python', 'Django', 'SQL']],
  ['Kavya Reddy', 'EXTC', 7.5, 0, ['MATLAB', 'Embedded C']],
]

// ---------- Companies (5 fictional) ----------
const COMPANIES: CompanyProfile[] = [
  {
    userId: 'c1', name: 'Nimbus Software Pvt Ltd', industry: 'IT Services',
    website: 'https://nimbus.example.com', description: 'Cloud and enterprise software company (fictional).',
    contactPerson: 'Neha Kapoor', contactEmail: 'hr@nimbus.example.com', status: 'approved',
  },
  {
    userId: 'c2', name: 'Axion Motors Ltd', industry: 'Automotive',
    website: 'https://axion.example.com', description: 'Vehicle components manufacturer (fictional).',
    contactPerson: 'Rajesh Menon', contactEmail: 'hr@axion.example.com', status: 'approved',
  },
  {
    userId: 'c3', name: 'Greenfield Infra', industry: 'Construction',
    website: 'https://greenfield.example.com', description: 'Infrastructure and civil projects (fictional).',
    contactPerson: 'Sunita Rane', contactEmail: 'hr@greenfield.example.com', status: 'approved',
  },
  {
    userId: 'c4', name: 'Pulse Electronics', industry: 'Electronics & IoT',
    website: 'https://pulse.example.com', description: 'Embedded devices and IoT products (fictional).',
    contactPerson: 'Amit Bhatt', contactEmail: 'hr@pulse.example.com', status: 'approved',
  },
  {
    userId: 'c5', name: 'Quantum Analytics', industry: 'Data & AI',
    website: 'https://quantum.example.com', description: 'Analytics consultancy (fictional). Awaiting approval.',
    contactPerson: 'Priya Nambiar', contactEmail: 'hr@quantum.example.com', status: 'pending',
  },
]

// ---------- Drives (8) ----------
interface DriveInput {
  id: string
  companyId: string
  type: OpportunityType
  title: string
  location: string
  packageLpa?: number
  stipend?: number
  minCgpa: number
  maxBacklogs: number
  depts: DepartmentCode[]
  skills: string[]
  status: DriveStatus
  deadlineIn: number // days from now (negative = already passed)
  createdAgo: number // days ago
}

function makeDrive(o: DriveInput): PlacementDrive {
  const company = COMPANIES.find((c) => c.userId === o.companyId)
  return {
    id: o.id,
    companyId: o.companyId,
    opportunityType: o.type,
    title: o.title,
    description: `${o.title} at ${company?.name}. Fictional listing for prototype testing.`,
    location: o.location,
    employmentType: o.type === 'internship' ? 'internship' : 'full_time',
    packageLpa: o.packageLpa,
    stipendPerMonth: o.stipend,
    minCgpa: o.minCgpa,
    maxBacklogs: o.maxBacklogs,
    eligibleDepartments: o.depts,
    requiredSkills: o.skills,
    deadline: daysFromNow(o.deadlineIn),
    status: o.status,
    createdAt: daysFromNow(-o.createdAgo),
  }
}

const DRIVES: PlacementDrive[] = [
  makeDrive({ id: 'd1', companyId: 'c1', type: 'placement', title: 'Software Engineer', location: 'Pune', packageLpa: 6.5, minCgpa: 7.0, maxBacklogs: 0, depts: ['CSE', 'IT', 'AIDS'], skills: ['Java', 'SQL'], status: 'published', deadlineIn: 12, createdAgo: 5 }),
  makeDrive({ id: 'd2', companyId: 'c1', type: 'internship', title: 'Frontend Developer Intern', location: 'Remote', stipend: 20000, minCgpa: 6.5, maxBacklogs: 1, depts: ['CSE', 'IT', 'AIDS', 'IOT'], skills: ['React', 'JavaScript'], status: 'published', deadlineIn: 20, createdAgo: 3 }),
  makeDrive({ id: 'd3', companyId: 'c2', type: 'placement', title: 'Graduate Engineer Trainee', location: 'Nashik', packageLpa: 4.8, minCgpa: 6.5, maxBacklogs: 1, depts: ['MECH', 'EXTC'], skills: ['AutoCAD'], status: 'published', deadlineIn: 9, createdAgo: 7 }),
  makeDrive({ id: 'd4', companyId: 'c3', type: 'placement', title: 'Site Engineer', location: 'Nagpur', packageLpa: 4.2, minCgpa: 6.0, maxBacklogs: 2, depts: ['CIVIL'], skills: ['AutoCAD', 'Revit'], status: 'published', deadlineIn: 15, createdAgo: 2 }),
  makeDrive({ id: 'd5', companyId: 'c4', type: 'placement', title: 'Embedded Systems Engineer', location: 'Bengaluru', packageLpa: 7.5, minCgpa: 7.5, maxBacklogs: 0, depts: ['EXTC', 'IOT', 'CSE'], skills: ['Embedded C'], status: 'published', deadlineIn: 6, createdAgo: 4 }),
  makeDrive({ id: 'd6', companyId: 'c4', type: 'internship', title: 'IoT Intern', location: 'Pune', stipend: 15000, minCgpa: 6.5, maxBacklogs: 1, depts: ['IOT', 'EXTC', 'IT'], skills: ['MQTT'], status: 'pending_approval', deadlineIn: 25, createdAgo: 1 }),
  makeDrive({ id: 'd7', companyId: 'c3', type: 'placement', title: 'Quantity Surveyor', location: 'Mumbai', packageLpa: 4.0, minCgpa: 6.5, maxBacklogs: 1, depts: ['CIVIL'], skills: ['Estimation'], status: 'closed', deadlineIn: -5, createdAgo: 30 }),
  makeDrive({ id: 'd8', companyId: 'c5', type: 'placement', title: 'Data Analyst', location: 'Hyderabad', packageLpa: 6.0, minCgpa: 7.0, maxBacklogs: 0, depts: ['AIDS', 'CSE', 'IT'], skills: ['Python', 'SQL'], status: 'draft', deadlineIn: 30, createdAgo: 1 }),
]

// Each application walks through these steps; the last one is its current status.
const PATHS: Record<ApplicationStatus, ApplicationStatus[]> = {
  applied: ['applied'],
  under_review: ['applied', 'under_review'],
  shortlisted: ['applied', 'under_review', 'shortlisted'],
  interview_scheduled: ['applied', 'under_review', 'shortlisted', 'interview_scheduled'],
  selected: ['applied', 'under_review', 'shortlisted', 'interview_scheduled', 'selected'],
  rejected: ['applied', 'under_review', 'rejected'],
  withdrawn: ['applied', 'withdrawn'],
}
const STATUS_CYCLE: ApplicationStatus[] = [
  'applied', 'under_review', 'shortlisted', 'interview_scheduled', 'selected', 'rejected',
]

export function createSeed(): MockDB {
  const profiles: Profile[] = []
  const passwords: Record<string, string> = {}
  const students: StudentProfile[] = []
  const applications: Application[] = []
  const history: ApplicationStatusHistory[] = []

  // Admin
  profiles.push({
    id: 'a1', role: 'tp_admin', fullName: 'T&P Officer (Demo)',
    email: 'tp.admin@example.edu', isActive: true,
  })
  passwords['a1'] = DEMO_PASSWORD

  // Companies
  for (const c of COMPANIES) {
    profiles.push({
      id: c.userId, role: 'company', fullName: c.contactPerson,
      email: c.contactEmail, isActive: true,
    })
    passwords[c.userId] = DEMO_PASSWORD
  }

  // Students
  RAW_STUDENTS.forEach(([name, dept, cgpa, backlogs, skills], i) => {
    const id = `s${i + 1}`
    const [first, last] = name.split(' ')
    profiles.push({
      id, role: 'student', fullName: name,
      email: `${first}.${last}@student.example.edu`.toLowerCase(), isActive: true,
    })
    passwords[id] = DEMO_PASSWORD
    students.push({
      userId: id,
      prn: `PRN2023${String(i + 1).padStart(3, '0')}`,
      department: dept,
      batchYear: 2027,
      currentYear: 4,
      cgpa,
      activeBacklogs: backlogs,
      // Some fields left empty on purpose so profile completion varies
      phone: i % 4 !== 3 ? `90000${10000 + i}` : undefined,
      resumeSummary:
        i % 5 !== 4 ? `${dept} student skilled in ${skills.slice(0, 2).join(' and ')}.` : undefined,
      skills,
      projects:
        i % 2 === 0
          ? [{ id: `p${i + 1}`, title: `${skills[0]} Mini Project`, description: 'Course project built with a small team.', techStack: skills.slice(0, 2) }]
          : [],
      experiences:
        i % 3 === 0
          ? [{ id: `e${i + 1}`, organization: 'Campus Tech Club', role: 'Volunteer Developer', startDate: '2025-06-01', endDate: '2025-08-01', description: 'Fictional experience entry.' }]
          : [],
    })
  })

  // Applications: only eligible students apply to published drives
  const published = DRIVES.filter((d) => d.status === 'published')
  let appN = 0
  let histN = 0
  students.forEach((sp, i) => {
    published.forEach((drive, j) => {
      if ((i + j) % 2 !== 0) return
      const company = COMPANIES.find((c) => c.userId === drive.companyId)
      const check = checkEligibility(sp, drive, {
        companyApproved: company?.status === 'approved',
        alreadyApplied: false,
      })
      if (!check.eligible) return

      appN++
      const status = STATUS_CYCLE[(i + j + appN) % STATUS_CYCLE.length]
      const path = PATHS[status]
      const appId = `app${appN}`
      const appliedAt = daysFromNow(-(path.length + 1))
      const lastChange = daysFromNow(-2)

      applications.push({
        id: appId,
        driveId: drive.id,
        studentId: sp.userId,
        status,
        appliedAt,
        updatedAt: path.length === 1 ? appliedAt : lastChange,
        finalPackageLpa: status === 'selected' ? drive.packageLpa : undefined,
      })

      path.forEach((to, k) => {
        histN++
        history.push({
          id: `h${histN}`,
          applicationId: appId,
          fromStatus: k === 0 ? null : path[k - 1],
          toStatus: to,
          changedBy: k === 0 ? sp.userId : drive.companyId,
          interviewRound: to === 'interview_scheduled' ? 'Technical Round 1' : undefined,
          changedAt: daysFromNow(-(path.length + 1 - k)),
        })
      })
    })
  })

  return {
    version: DB_VERSION,
    profiles,
    passwords,
    students,
    companies: COMPANIES.map((c) => ({ ...c })),
    drives: DRIVES.map((d) => ({ ...d })),
    applications,
    history,
  }
}