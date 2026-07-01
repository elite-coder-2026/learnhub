import { Request, Response } from 'express'
import * as wishlistService from '../services/wishlist.service'
import { NotFoundError, ValidationError } from '../utils/errors'
import { paramString } from '../utils/params'

export const addToWishlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.user!.id
    const courseId = paramString(req.params.courseId)
    const item = await wishlistService.addToWishlist(studentId, courseId)
    res.status(201).json({ data: item })
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

export const removeFromWishlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.user!.id
    const courseId = paramString(req.params.courseId)
    await wishlistService.removeFromWishlist(studentId, courseId)
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

export const listWishlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.user!.id
    const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : null
    const limit = req.query.limit ? Number(req.query.limit) : 20
    const result = await wishlistService.getWishlist(studentId, cursor, limit)
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
