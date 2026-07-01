import { Request, Response } from 'express'
import * as adminService from '../services/admin.service'
import { FraudFlagStatus } from '../types/fraud.type'
import { User } from '../types/user.type'
import { NotFoundError, ValidationError } from '../utils/errors'
import { paramString } from '../utils/params'

const toSafeUser = (user: User): Omit<User, 'password' | 'password_hash'> => {
  const { password: _password, password_hash: _passwordHash, ...safeUser } = user
  return safeUser
}

const handleError = (error: unknown, res: Response): void => {
  if (error instanceof NotFoundError) {
    res.status(404).json({ error: error.message })
    return
  }
  if (error instanceof ValidationError) {
    res.status(400).json({ error: error.message })
    return
  }
  console.error(error)
  res.status(500).json({ error: 'Internal server error' })
}

export const listUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : null
    const limit = req.query.limit ? Number(req.query.limit) : 20
    const result = await adminService.listUsers(cursor, limit)
    res.json({ ...result, data: result.data.map(toSafeUser) })
  } catch (error) {
    handleError(error, res)
  }
}

export const deactivateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = paramString(req.params.id)
    await adminService.deactivateUser(userId)
    res.status(204).send()
  } catch (error) {
    handleError(error, res)
  }
}

export const listCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : null
    const limit = req.query.limit ? Number(req.query.limit) : 20
    const result = await adminService.listCourses(cursor, limit)
    res.json(result)
  } catch (error) {
    handleError(error, res)
  }
}

export const removeCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const courseId = paramString(req.params.id)
    await adminService.removeCourse(courseId)
    res.status(204).send()
  } catch (error) {
    handleError(error, res)
  }
}

export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const topCoursesLimit = req.query.topCoursesLimit ? Number(req.query.topCoursesLimit) : 5
    const analytics = await adminService.getPlatformAnalytics(topCoursesLimit)
    res.json({ data: analytics })
  } catch (error) {
    handleError(error, res)
  }
}

export const listFraudFlags = async (req: Request, res: Response): Promise<void> => {
  try {
    const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : null
    const limit = req.query.limit ? Number(req.query.limit) : 20
    const status = typeof req.query.status === 'string' ? (req.query.status as FraudFlagStatus) : null
    const result = await adminService.listFraudFlags(cursor, limit, status)
    res.json(result)
  } catch (error) {
    handleError(error, res)
  }
}

export const reviewFraudFlag = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviewerId = req.user!.id
    const flagId = paramString(req.params.id)
    const status = req.body.status as FraudFlagStatus
    const updated = await adminService.reviewFraudFlag(flagId, reviewerId, status)
    res.json({ data: updated })
  } catch (error) {
    handleError(error, res)
  }
}
