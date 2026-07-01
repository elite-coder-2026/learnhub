import { Request, Response } from 'express'
import * as certificateService from '../services/certificate.service'
import { NotFoundError, UnauthorizedError } from '../utils/errors'
import { paramString } from '../utils/params'

export const listCertificates = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.user!.id
    const certificates = await certificateService.listCertificatesForStudent(studentId)
    res.json({ data: certificates })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const downloadCertificate = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.user!.id
    const certificateId = paramString(req.params.id)
    const certificate = await certificateService.getCertificateForDownload(certificateId, studentId)
    res.download(certificate.file_path, `certificate-${certificate.id}.pdf`)
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    if (error instanceof UnauthorizedError) {
      res.status(401).json({ error: error.message })
      return
    }
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
