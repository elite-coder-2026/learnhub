import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { getCurrentUser } from '../services/userService'
import type { CurrentUser } from '../types/user'

export const useCurrentUser = (): UseQueryResult<CurrentUser, Error> => {
  const { user, token } = useAuth()
  return useQuery<CurrentUser, Error>({
    queryKey: ['currentUser', user?.userId],
    queryFn: async () => getCurrentUser(user?.userId ?? '', token ?? ''),
    enabled: user !== null && token !== null,
  })
}
