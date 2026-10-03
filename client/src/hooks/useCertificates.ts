import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { listCertificates } from '../services/certificateService'
import type { Certificate } from '../types/certificate'

export const useCertificates = (): UseQueryResult<Certificate[], Error> => {
  const { token } = useAuth()
  return useQuery<Certificate[], Error>({
    queryKey: ['certificates'],
    queryFn: async () => listCertificates(token ?? ''),
    enabled: token !== null,
  })
}
