import { Router } from 'express'
import {
  createAssignment,
  getCourseAssignments,
  submitAssignment,
  getMySubmission,
  getSubmissionsForAssignment,
  gradeSubmission
} from '../controllers/assignment.controller'
import { requireAuth, requireRole } from '../middleware/authMiddleware'

const router = Router()

router.post('/courses/:courseId/assignments', requireAuth, requireRole('instructor'), createAssignment)
router.get('/courses/:courseId/assignments', getCourseAssignments)

router.post('/assignments/:assignmentId/submit', requireAuth, requireRole('student'), submitAssignment)
router.get('/assignments/:assignmentId/my-submission', requireAuth, requireRole('student'), getMySubmission)
router.get('/assignments/:assignmentId/submissions', requireAuth, requireRole('instructor'), getSubmissionsForAssignment)

router.put('/submissions/:submissionId/grade', requireAuth, requireRole('instructor'), gradeSubmission)

export default router
