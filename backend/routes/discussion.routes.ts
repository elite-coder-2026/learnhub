import { Router } from 'express'
import { createDiscussionPost, getLessonDiscussionPosts } from '../controllers/discussion.controller'
import { requireAuth } from '../middleware/authMiddleware'

const router = Router()

router.post('/lessons/:lessonId/discussion', requireAuth, createDiscussionPost)
router.get('/lessons/:lessonId/discussion', requireAuth, getLessonDiscussionPosts)

export default router
