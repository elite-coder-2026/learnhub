import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
  type UseInfiniteQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query'
import { useAuth } from './useAuth'
import {
  deactivateUser,
  listAdminCourses,
  listAdminUsers,
  listFraudFlags,
  removeCourse,
  reviewFraudFlag,
} from '../services/adminService'
import type { AdminUser, FraudFlag, FraudFlagStatus } from '../types/admin'
import type { Course } from '../types/course'
import type { PaginatedResponse } from '../types/pagination'

type InfiniteList<T> = UseInfiniteQueryResult<InfiniteData<PaginatedResponse<T>>, Error>

const nextCursor = <T>(page: PaginatedResponse<T>): string | undefined => (page.hasMore ? (page.nextCursor ?? undefined) : undefined)

export const useAdminUsers = (): InfiniteList<AdminUser> => {
  const { token } = useAuth()
  return useInfiniteQuery<PaginatedResponse<AdminUser>, Error, InfiniteData<PaginatedResponse<AdminUser>>, string[], string | null>({
    queryKey: ['admin', 'users'],
    initialPageParam: null,
    queryFn: async ({ pageParam }) => listAdminUsers(pageParam, token ?? ''),
    getNextPageParam: nextCursor,
    enabled: token !== null,
  })
}

export const useAdminCourses = (): InfiniteList<Course> => {
  const { token } = useAuth()
  return useInfiniteQuery<PaginatedResponse<Course>, Error, InfiniteData<PaginatedResponse<Course>>, string[], string | null>({
    queryKey: ['admin', 'courses'],
    initialPageParam: null,
    queryFn: async ({ pageParam }) => listAdminCourses(pageParam, token ?? ''),
    getNextPageParam: nextCursor,
    enabled: token !== null,
  })
}

export const useFraudFlags = (status: FraudFlagStatus | null): InfiniteList<FraudFlag> => {
  const { token } = useAuth()
  return useInfiniteQuery<PaginatedResponse<FraudFlag>, Error, InfiniteData<PaginatedResponse<FraudFlag>>, string[], string | null>({
    queryKey: ['admin', 'fraud-flags', status ?? 'all'],
    initialPageParam: null,
    queryFn: async ({ pageParam }) => listFraudFlags(pageParam, status, token ?? ''),
    getNextPageParam: nextCursor,
    enabled: token !== null,
  })
}

const useAdminMutation = <TVariables, TResult>(
  mutate: (variables: TVariables, token: string) => Promise<TResult>,
  invalidateKey: string[],
): UseMutationResult<TResult, Error, TVariables> => {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  return useMutation<TResult, Error, TVariables>({
    mutationFn: async (variables) => mutate(variables, token ?? ''),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: invalidateKey })
    },
  })
}

export const useDeactivateUser = (): UseMutationResult<AdminUser, Error, string> =>
  useAdminMutation(deactivateUser, ['admin', 'users'])

export const useRemoveCourse = (): UseMutationResult<void, Error, string> =>
  useAdminMutation(removeCourse, ['admin', 'courses'])

export const useReviewFraudFlag = (): UseMutationResult<FraudFlag, Error, { id: string; status: FraudFlagStatus }> =>
  useAdminMutation(async ({ id, status }, token) => reviewFraudFlag(id, status, token), ['admin', 'fraud-flags'])
