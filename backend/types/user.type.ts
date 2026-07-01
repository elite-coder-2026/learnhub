export interface User {
  id: string
  email: string
  password: string | null
  password_hash: string | null
  avatar_url: string | null
  user_role: string
  first_name: string | null
  last_name: string | null
  is_active: boolean
  is_email_verified: boolean
  created_at: Date
  updated_at: Date
}
