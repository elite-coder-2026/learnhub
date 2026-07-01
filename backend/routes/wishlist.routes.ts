import { Router } from 'express'
import { addToWishlist, removeFromWishlist, listWishlist } from '../controllers/wishlist.controller'
import { requireAuth } from '../middleware/authMiddleware'

const router = Router()

router.get('/', requireAuth, listWishlist)
router.post('/:courseId', requireAuth, addToWishlist)
router.delete('/:courseId', requireAuth, removeFromWishlist)

export default router
