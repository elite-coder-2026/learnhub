export type UserRole = 'student' | 'instructor'

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  userRole: UserRole
}

export interface RegisterResult {
  token: string
  userId: string
}

export interface AccessTokenPayload {
  sub: string
  role: UserRole
}

export interface AuthUser {
  userId: string
  role: UserRole
}
