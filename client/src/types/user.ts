import type { UserRole } from './auth'

export interface CurrentUser {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  user_role: UserRole
}
