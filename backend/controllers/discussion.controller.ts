import { Request, Response } from 'express'
import * as discussionService from '../services/discussion.service'
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

export const createDiscussionPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id
    const userRole = req.user!.role
    const lessonId = paramString(req.params.lessonId)
    const { body } = req.body
    const post = await discussionService.createDiscussionPost(userId, userRole, lessonId, body)
    res.status(201).json({ data: post })
  } catch (error) {
    handleError(error, res)
  }
}

export const getLessonDiscussionPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id
    const userRole = req.user!.role
    const lessonId = paramString(req.params.lessonId)
    const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : null
    const limit = req.query.limit ? Number(req.query.limit) : 20
    const result = await discussionService.getDiscussionPostsForLesson(userId, userRole, lessonId, cursor, limit)
    res.json(result)
  } catch (error) {
    handleError(error, res)
  }
}
