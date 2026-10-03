import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { downloadCertificate } from '../services/certificateService'
import { saveBlob } from '../utils/download'

export const useDownloadCertificate = (): UseMutationResult<void, Error, string> => {
  const { token } = useAuth()
  return useMutation<void, Error, string>({
    mutationFn: async (certificateId) => {
      const blob = await downloadCertificate(certificateId, token ?? '')
      saveBlob(blob, `certificate-${certificateId}.pdf`)
    },
  })
}
