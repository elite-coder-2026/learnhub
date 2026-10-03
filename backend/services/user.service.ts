import * as userQueries from '../queries/user.query'
import { TopInstructor, User } from '../types/user.type'
import { NotFoundError, UnauthorizedError, ValidationError } from '../utils/errors'

export const getUserById = async (id: string): Promise<User> => {
  const user = await userQueries.findUserById(id)
  if (!user) throw new NotFoundError(`User ${id} not found`)
  return user
}

export const updateUser = async (
  requestingRole: string,
  id: string,
  firstName: string,
  lastName: string,
  userRole: string
): Promise<User> => {
  const existing = await getUserById(id)
  if (requestingRole !== 'admin' && userRole !== existing.user_role) {
    throw new UnauthorizedError('Only an admin can change a user role')
  }

  const user = await userQueries.updateUser(id, firstName, lastName, userRole)
  if (!user) throw new NotFoundError(`User ${id} not found`)
  return user
}

export const deleteUser = async (id: string): Promise<void> => {
  await getUserById(id)
  await userQueries.deleteUser(id)
}

const MAX_TOP_INSTRUCTORS = 12

export const getTopInstructors = async (limit: number): Promise<TopInstructor[]> => {
  if (!Number.isInteger(limit) || limit < 1) throw new ValidationError('limit must be a positive integer')
  return userQueries.findTopInstructors(Math.min(limit, MAX_TOP_INSTRUCTORS))
}
