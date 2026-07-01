import { Request, Response } from 'express'
import * as reviewService from '../services/review.service'
import { NotFoundError, UnauthorizedError, ValidationError } from '../utils/errors'
import { paramString } from '../utils/params'

export const submitReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.user!.id
    const courseId = paramString(req.params.id)
    const { rating, comment } = req.body
    const review = await reviewService.submitReview(studentId, courseId, rating, comment ?? null)
    res.status(201).json({ data: review })
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

export const listReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const courseId = paramString(req.params.id)
    const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : null
    const limit = req.query.limit ? Number(req.query.limit) : 20
    const result = await reviewService.listReviewsForCourse(courseId, cursor, limit)
    res.json(result)
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.user!.id
    const courseId = paramString(req.params.id)
    await reviewService.deleteReview(studentId, courseId)
    res.status(204).send()
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
