import { apiGet } from './apiClient'
import type { CurrentUser } from '../types/user'

export const getCurrentUser = async (userId: string, token: string): Promise<CurrentUser> =>
  apiGet<CurrentUser>(`/users/${userId}`, token)
