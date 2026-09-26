import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env'
import { UnauthorizedError } from '../utils/errors'

export interface AuthenticatedUser {
  id: string
  role: string
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthenticatedUser
  }
}

interface AccessTokenPayload {
  sub: string
  role: string
}

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or malformed Authorization header')
    }

    const token = authHeader.slice('Bearer '.length)
    const payload = jwt.verify(token, JWT_SECRET) as AccessTokenPayload
    req.user = { id: payload.sub, role: payload.role }
    next()
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).json({ error: error.message })
      return
    }
    console.error(error)
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    if (req.user.role !== role) {
      res.status(403).json({ error: 'Forbidden' })
      return
    }
    next()
  }
}

export const requireSelfOrAdmin = (paramName: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    if (req.user.role === 'admin' || req.user.id === req.params[paramName]) {
      next()
      return
    }
    res.status(403).json({ error: 'Forbidden' })
  }
}
