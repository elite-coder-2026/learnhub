import { Request, Response } from 'express'
import * as enrollmentService from '../services/enrollment.service'
import { CourseLevel } from '../types/course.type'
import { NotFoundError, UnauthorizedError, ValidationError } from '../utils/errors'
import { paramString } from '../utils/params'

const VALID_LEVELS: CourseLevel[] = ['beginner', 'intermediate', 'advanced']

const queryString = (value: unknown): string | null => (typeof value === 'string' ? value : null)

export const listCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const cursor = queryString(req.query.cursor)
    const limit = req.query.limit ? Number(req.query.limit) : 20

    const search = queryString(req.query.search)
    const category = queryString(req.query.category)
    const instructorId = queryString(req.query.instructor_id)
    const level = queryString(req.query.level)

    if (level !== null && !VALID_LEVELS.includes(level as CourseLevel)) {
      throw new ValidationError(`Invalid level: ${level}`)
    }

    const isFiltered = search !== null || category !== null || instructorId !== null || level !== null

    const result = isFiltered
      ? await enrollmentService.searchCourses(
          { search, category, instructorId, level: level as CourseLevel | null },
          cursor,
          limit
        )
      : await enrollmentService.browseCourses(cursor, limit)

    res.json(result)
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message })
      return
    }
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const enrollInCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.user!.id
    const courseId = paramString(req.params.id)
    const enrollment = await enrollmentService.enrollInCourse(studentId, courseId)
    res.status(201).json({ data: enrollment })
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message })
      return
    }
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getEnrolledStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const instructorId = req.user!.id
    const courseId = paramString(req.params.id)
    const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : null
    const limit = req.query.limit ? Number(req.query.limit) : 20
    const result = await enrollmentService.getEnrolledStudents(instructorId, courseId, cursor, limit)
    res.json(result)
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
