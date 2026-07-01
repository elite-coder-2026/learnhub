import { Request, Response } from 'express'
import * as assignmentService from '../services/assignment.service'
import { NotFoundError, UnauthorizedError, ValidationError } from '../utils/errors'
import { paramString } from '../utils/params'

const handleError = (error: unknown, res: Response): void => {
  if (error instanceof ValidationError) {
    res.status(400).json({ error: error.message })
    return
  }
  if (error instanceof UnauthorizedError) {
    res.status(401).json({ error: error.message })
    return
  }
  if (error instanceof NotFoundError) {
    res.status(404).json({ error: error.message })
    return
  }
  console.error(error)
  res.status(500).json({ error: 'Internal server error' })
}

export const createAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const instructorId = req.user!.id
    const courseId = paramString(req.params.courseId)
    const { title, description } = req.body
    const assignment = await assignmentService.createAssignment(instructorId, courseId, { title, description })
    res.status(201).json({ data: assignment })
  } catch (error) {
    handleError(error, res)
  }
}

export const getCourseAssignments = async (req: Request, res: Response): Promise<void> => {
  try {
    const courseId = paramString(req.params.courseId)
    const assignments = await assignmentService.getAssignmentsForCourse(courseId)
    res.json({ data: assignments })
  } catch (error) {
    handleError(error, res)
  }
}

export const submitAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.user!.id
    const assignmentId = paramString(req.params.assignmentId)
    const { submissionText, fileUrl } = req.body
    const submission = await assignmentService.submitAssignment(studentId, assignmentId, { submissionText, fileUrl })
    res.status(201).json({ data: submission })
  } catch (error) {
    handleError(error, res)
  }
}

export const getMySubmission = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.user!.id
    const assignmentId = paramString(req.params.assignmentId)
    const submission = await assignmentService.getMySubmission(studentId, assignmentId)
    res.json({ data: submission })
  } catch (error) {
    handleError(error, res)
  }
}

export const getSubmissionsForAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const instructorId = req.user!.id
    const assignmentId = paramString(req.params.assignmentId)
    const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : null
    const limit = req.query.limit ? Number(req.query.limit) : 20
    const result = await assignmentService.getSubmissionsForAssignment(instructorId, assignmentId, cursor, limit)
    res.json(result)
  } catch (error) {
    handleError(error, res)
  }
}

export const gradeSubmission = async (req: Request, res: Response): Promise<void> => {
  try {
    const instructorId = req.user!.id
    const submissionId = paramString(req.params.submissionId)
    const { grade, feedback } = req.body
    const submission = await assignmentService.gradeSubmission(instructorId, submissionId, { grade, feedback })
    res.json({ data: submission })
  } catch (error) {
    handleError(error, res)
  }
}
