import { Request, Response } from 'express'
import * as storageService from '../services/storage.service'
import { NotFoundError, UnauthorizedError, ValidationError } from '../utils/errors'
import { paramString } from '../utils/params'

export const createLessonUploadUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const instructorId = req.user!.id
    const courseId = paramString(req.params.id)
    const { contentType } = req.body
    const result = await storageService.requestLessonUploadUrl(instructorId, courseId, contentType)
    res.status(201).json({ data: result })
  } catch (error) {
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
}
