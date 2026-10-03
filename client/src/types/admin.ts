import type { UserRole } from './auth'

export interface AdminUser {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  user_role: UserRole
  is_active: boolean
  last_login_at: string | null
  created_at: string
}

export type FraudFlagStatus = 'pending' | 'reviewed' | 'dismissed'

export interface FraudFlag {
  id: string
  student_id: string
  course_id: string
  risk_score: number
  reason: string | null
  status: FraudFlagStatus
  reviewed_at: string | null
  created_at: string
  student_email: string
  student_first_name: string | null
  student_last_name: string | null
  course_title: string
}
