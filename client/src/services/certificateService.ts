import { apiGet, apiGetBlob } from './apiClient'
import type { Certificate } from '../types/certificate'

export const listCertificates = async (token: string): Promise<Certificate[]> =>
  apiGet<Certificate[]>('/certificates', token)

export const downloadCertificate = async (certificateId: string, token: string): Promise<Blob> =>
  apiGetBlob(`/certificates/${certificateId}/download`, token)
