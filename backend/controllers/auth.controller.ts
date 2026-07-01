import { Request, Response } from 'express'
import * as authService from '../services/auth.service'
import { UnauthorizedError, ValidationError } from '../utils/errors'

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, userRole } = req.body
    const result = await authService.register({ email, password, firstName, lastName, userRole })
    res.status(201).json({ data: result })
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message })
      return
    }
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body
    const result = await authService.login({ email, password })
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
