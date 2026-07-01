import { Request, Response } from 'express'
import * as progressService from '../services/progress.service'
import { NotFoundError, UnauthorizedError } from '../utils/errors'
import { paramString } from '../utils/params'

export const getLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.user!.id
    const lessonId = paramString(req.params.lessonId)
    const lesson = await progressService.getLessonContent(studentId, lessonId)
    res.json({ data: lesson })
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

export const completeLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.user!.id
    const lessonId = paramString(req.params.lessonId)
    const progress = await progressService.completeLesson(studentId, lessonId)
    res.json({ data: progress })
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

export const uncompleteLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.user!.id
    const lessonId = paramString(req.params.lessonId)
    const progress = await progressService.uncompleteLesson(studentId, lessonId)
    res.json({ data: progress })
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

export const getCourseProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.user!.id
    const courseId = paramString(req.params.courseId)
    const result = await progressService.getProgressForCourse(studentId, courseId)
    res.json({ data: result })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).json({ error: error.message })
      return
    }
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.user!.id
    const result = await progressService.getStudentDashboard(studentId)
    res.json({ data: result })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
