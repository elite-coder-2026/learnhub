import { apiGet } from './apiClient'
import type { Certificate } from '../types/certificate'

export const listCertificates = async (token: string): Promise<Certificate[]> =>
  apiGet<Certificate[]>('/certificates', token)
