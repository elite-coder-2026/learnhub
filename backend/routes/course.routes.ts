import { Router } from 'express'
import {
  createCourse,
  getCourse,
  updateCourse,
  addModule,
  updateModule,
  deleteModule,
  addLesson,
  updateLesson,
  deleteLesson,
  bulkAddLessons,
  reorderLessons,
  getAnalytics,
  getDownloadManifest
} from '../controllers/course.controller'
import { listCourses, enrollInCourse, getEnrolledStudents } from '../controllers/enrollment.controller'
import { submitReview, listReviews, deleteReview } from '../controllers/review.controller'
import { createLessonUploadUrl } from '../controllers/storage.controller'
import { requireAuth, requireRole } from '../middleware/authMiddleware'

const router = Router()

router.get('/', listCourses)
router.post('/', requireAuth, requireRole('instructor'), createCourse)
router.get('/analytics', requireAuth, requireRole('instructor'), getAnalytics)
router.get('/:id', getCourse)
router.post('/:id/enroll', requireAuth, requireRole('student'), enrollInCourse)
router.get('/:id/students', requireAuth, requireRole('instructor'), getEnrolledStudents)
router.get('/:id/download-manifest', requireAuth, requireRole('student'), getDownloadManifest)
router.post('/:id/upload-url', requireAuth, requireRole('instructor'), createLessonUploadUrl)
router.put('/:id', requireAuth, requireRole('instructor'), updateCourse)

router.post('/:id/reviews', requireAuth, requireRole('student'), submitReview)
router.get('/:id/reviews', listReviews)
router.delete('/:id/reviews', requireAuth, requireRole('student'), deleteReview)

router.post('/:id/modules', requireAuth, requireRole('instructor'), addModule)
router.put('/modules/:moduleId', requireAuth, requireRole('instructor'), updateModule)
router.delete('/modules/:moduleId', requireAuth, requireRole('instructor'), deleteModule)

router.post('/modules/:moduleId/lessons', requireAuth, requireRole('instructor'), addLesson)
router.post('/modules/:moduleId/lessons/bulk', requireAuth, requireRole('instructor'), bulkAddLessons)
router.put('/modules/:moduleId/lessons/reorder', requireAuth, requireRole('instructor'), reorderLessons)
router.put('/lessons/:lessonId', requireAuth, requireRole('instructor'), updateLesson)
router.delete('/lessons/:lessonId', requireAuth, requireRole('instructor'), deleteLesson)

export default router
