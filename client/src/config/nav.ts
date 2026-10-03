import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import PeopleIcon from '@mui/icons-material/People'
import FlagIcon from '@mui/icons-material/Flag'
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined'
import type { SidebarNavItem } from '../components/Sidebar'
import type { UserRole } from '../types/auth'

export const STUDENT_NAV: SidebarNavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: SpaceDashboardIcon },
  { label: 'Courses', to: '/courses', icon: MenuBookIcon },
  { label: 'Certificates', to: '/certificates', icon: WorkspacePremiumIcon },
]

export const INSTRUCTOR_NAV: SidebarNavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: SpaceDashboardIcon },
  { label: 'My Courses', to: '/courses', icon: MenuBookIcon },
  { label: 'Create Course', to: '/courses/new', icon: AddCircleOutlinedIcon },
  { label: 'Submissions', to: '/submissions', icon: AssignmentTurnedInIcon },
]

export const ADMIN_NAV: SidebarNavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: SpaceDashboardIcon },
  { label: 'Users', to: '/admin/users', icon: PeopleIcon },
  { label: 'Courses', to: '/admin/courses', icon: MenuBookIcon },
  { label: 'Fraud Flags', to: '/admin/fraud-flags', icon: FlagIcon },
]

export const NAV_BY_ROLE: Record<UserRole, SidebarNavItem[]> = {
  student: STUDENT_NAV,
  instructor: INSTRUCTOR_NAV,
  admin: ADMIN_NAV,
}
