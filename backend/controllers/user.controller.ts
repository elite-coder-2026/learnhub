import { Request, Response } from 'express'
import * as userService from '../services/user.service'
import { NotFoundError, UnauthorizedError } from '../utils/errors'
import { paramString } from '../utils/params'
import { User } from '../types/user.type'

const toSafeUser = (user: User): Omit<User, 'password' | 'password_hash'> => {
  const { password: _password, password_hash: _passwordHash, ...safeUser } = user
  return safeUser
}

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.getUserById(paramString(req.params.id))
    res.json({ data: toSafeUser(user) })
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, userRole } = req.body
    const user = await userService.updateUser(req.user!.role, paramString(req.params.id), firstName, lastName, userRole)
    res.json({ data: toSafeUser(user) })
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

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    await userService.deleteUser(paramString(req.params.id))
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
