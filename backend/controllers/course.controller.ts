import { Request, Response } from 'express'
import * as courseService from '../services/course.service'
import { CreateLessonInput } from '../types/course.type'
import { NotFoundError, UnauthorizedError, ValidationError } from '../utils/errors'
import { paramString } from '../utils/params'

export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const instructorId = req.user!.id
    const { title, description, modules } = req.body
    const course = await courseService.createCourse(instructorId, { title, description, modules })
    res.status(201).json({ data: course })
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message })
      return
    }
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const instructorId = req.user!.id
    const analytics = await courseService.getAnalyticsForInstructor(instructorId)
    res.json({ data: analytics })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const handleWriteError = (error: unknown, res: Response): void => {
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

export const getCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const courseId = paramString(req.params.id)
    const course = await courseService.getCourseWithStructure(courseId)
    res.json({ data: course })
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getDownloadManifest = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.user!.id
    const courseId = paramString(req.params.id)
    const manifest = await courseService.getDownloadManifest(studentId, courseId)
    res.json({ data: manifest })
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

export const updateCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const instructorId = req.user!.id
    const courseId = paramString(req.params.id)
    const { title, description } = req.body
    const course = await courseService.updateCourse(instructorId, courseId, { title, description })
    res.json({ data: course })
  } catch (error) {
    handleWriteError(error, res)
  }
}

export const addModule = async (req: Request, res: Response): Promise<void> => {
  try {
    const instructorId = req.user!.id
    const courseId = paramString(req.params.id)
    const { title } = req.body
    const module = await courseService.addModule(instructorId, courseId, { title })
    res.status(201).json({ data: module })
  } catch (error) {
    handleWriteError(error, res)
  }
}

export const updateModule = async (req: Request, res: Response): Promise<void> => {
  try {
    const instructorId = req.user!.id
    const moduleId = paramString(req.params.moduleId)
    const { title, position } = req.body
    const module = await courseService.updateModule(instructorId, moduleId, { title, position })
    res.json({ data: module })
  } catch (error) {
    handleWriteError(error, res)
  }
}

export const deleteModule = async (req: Request, res: Response): Promise<void> => {
  try {
    const instructorId = req.user!.id
    const moduleId = paramString(req.params.moduleId)
    await courseService.deleteModule(instructorId, moduleId)
    res.status(204).send()
  } catch (error) {
    handleWriteError(error, res)
  }
}

export const addLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const instructorId = req.user!.id
    const moduleId = paramString(req.params.moduleId)
    const { title, contentUrl } = req.body
    const lesson = await courseService.addLesson(instructorId, moduleId, { title, contentUrl })
    res.status(201).json({ data: lesson })
  } catch (error) {
    handleWriteError(error, res)
  }
}

export const updateLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const instructorId = req.user!.id
    const lessonId = paramString(req.params.lessonId)
    const { title, contentUrl, position } = req.body
    const lesson = await courseService.updateLesson(instructorId, lessonId, { title, contentUrl, position })
    res.json({ data: lesson })
  } catch (error) {
    handleWriteError(error, res)
  }
}

export const deleteLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const instructorId = req.user!.id
    const lessonId = paramString(req.params.lessonId)
    await courseService.deleteLesson(instructorId, lessonId)
    res.status(204).send()
  } catch (error) {
    handleWriteError(error, res)
  }
}

export const bulkAddLessons = async (req: Request, res: Response): Promise<void> => {
  try {
    const instructorId = req.user!.id
    const moduleId = paramString(req.params.moduleId)
    const items: CreateLessonInput[] = Array.isArray(req.body) ? req.body : []
    const lessons = await courseService.bulkAddLessons(instructorId, moduleId, items)
    res.status(201).json({ data: lessons })
  } catch (error) {
    handleWriteError(error, res)
  }
}

export const reorderLessons = async (req: Request, res: Response): Promise<void> => {
  try {
    const instructorId = req.user!.id
    const moduleId = paramString(req.params.moduleId)
    const orderedLessonIds: string[] = Array.isArray(req.body) ? req.body : []
    const lessons = await courseService.reorderLessons(instructorId, moduleId, orderedLessonIds)
    res.json({ data: lessons })
  } catch (error) {
    handleWriteError(error, res)
  }
}
