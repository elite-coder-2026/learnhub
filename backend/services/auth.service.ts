import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import * as authQueries from '../queries/auth.query'
import * as userQueries from '../queries/user.query'
import { RegisterInput, LoginInput, AuthResult } from '../types/auth.type'
import { UnauthorizedError, ValidationError } from '../utils/errors'
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env'

const SALT_ROUNDS = 12
const VALID_ROLES = ['student', 'instructor', 'admin']

const signToken = (userId: string, userRole: string): string => {
  return jwt.sign({ sub: userId, role: userRole }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export const register = async (input: RegisterInput): Promise<AuthResult> => {
  if (!VALID_ROLES.includes(input.userRole)) {
    throw new ValidationError(`userRole must be one of: ${VALID_ROLES.join(', ')}`)
  }

  const existingUser = await authQueries.findUserByEmail(input.email)
  if (existingUser) throw new ValidationError('Email is already registered')

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS)
  const user = await userQueries.createUser(
    input.email,
    passwordHash,
    passwordHash,
    input.firstName,
    input.lastName,
    input.userRole
  )

  return { token: signToken(user.id, user.user_role), userId: user.id }
}

export const login = async (input: LoginInput): Promise<AuthResult> => {
  const user = await authQueries.findUserByEmail(input.email)
  if (!user || !user.password_hash) throw new UnauthorizedError('Invalid email or password')

  const isValidPassword = await bcrypt.compare(input.password, user.password_hash)
  if (!isValidPassword) throw new UnauthorizedError('Invalid email or password')

  return { token: signToken(user.id, user.user_role), userId: user.id }
}
