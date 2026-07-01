export interface RegisterInput {
  email: string
  password: string
  firstName: string
  lastName: string
  userRole: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface AuthResult {
  token: string
  userId: string
}
