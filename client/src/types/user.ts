import type { UserRole } from './auth'

export interface CurrentUser {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  user_role: UserRole
}

export interface TopInstructor {
  id: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  course_count: number
  student_count: number
}
