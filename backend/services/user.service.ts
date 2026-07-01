import * as userQueries from '../queries/user.query'
import { User } from '../types/user.type'
import { NotFoundError, UnauthorizedError } from '../utils/errors'

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
