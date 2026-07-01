import { Router } from 'express'
import { listCertificates, downloadCertificate } from '../controllers/certificate.controller'
import { requireAuth } from '../middleware/authMiddleware'

const router = Router()

router.get('/', requireAuth, listCertificates)
router.get('/:id/download', requireAuth, downloadCertificate)

export default router
