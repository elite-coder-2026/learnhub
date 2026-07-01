import { Router } from 'express'
import { getUser, updateUser, deleteUser } from '../controllers/user.controller'
import { requireAuth, requireSelfOrAdmin } from '../middleware/authMiddleware'

const router = Router()

router.get('/:id', requireAuth, requireSelfOrAdmin(), getUser)
router.put('/:id', requireAuth, requireSelfOrAdmin(), updateUser)
router.delete('/:id', requireAuth, requireSelfOrAdmin(), deleteUser)

export default router
