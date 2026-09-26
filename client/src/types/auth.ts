export type UserRole = 'student' | 'instructor' | 'admin'

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

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResult {
  token: string
  userId: string
}

export interface AccessTokenPayload {
  sub: string
  role: UserRole
  exp: number
}

export interface AuthUser {
  userId: string
  role: UserRole
}
