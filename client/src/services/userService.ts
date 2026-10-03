import { apiGet } from './apiClient'
import type { CurrentUser, TopInstructor } from '../types/user'

export const getCurrentUser = async (userId: string, token: string): Promise<CurrentUser> =>
  apiGet<CurrentUser>(`/users/${userId}`, token)

export const listTopInstructors = async (limit: number): Promise<TopInstructor[]> =>
  apiGet<TopInstructor[]>(`/users/instructors/top?limit=${limit}`)
