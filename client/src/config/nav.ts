import type { SidebarNavItem } from '../components/Sidebar'
import type { UserRole } from '../types/auth'

export const STUDENT_NAV: SidebarNavItem[] = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Courses', to: '/courses' },
  { label: 'Certificates', to: '/certificates' },
]

export const INSTRUCTOR_NAV: SidebarNavItem[] = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'My Courses', to: '/courses' },
  { label: 'Submissions', to: '/submissions' },
]

export const ADMIN_NAV: SidebarNavItem[] = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Users', to: '/admin/users' },
  { label: 'Courses', to: '/admin/courses' },
  { label: 'Fraud Flags', to: '/admin/fraud-flags' },
]

export const NAV_BY_ROLE: Record<UserRole, SidebarNavItem[]> = {
  student: STUDENT_NAV,
  instructor: INSTRUCTOR_NAV,
  admin: ADMIN_NAV,
}
