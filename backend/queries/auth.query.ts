import { pool } from '../config/db'
import { User } from '../types/user.type'

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query<User>(
    `SELECT id, email, password_hash, avatar_url, user_role, first_name, last_name, is_active, is_email_verified, last_login_at, created_at, updated_at
     FROM nx.users
     WHERE email = $1
       AND deleted_at IS NULL`,
    [email]
  )
  return result.rows[0] ?? null
}

export const createUser = async (
  email: string,
  passwordHash: string,
  firstName: string,
  lastName: string,
  userRole: string
): Promise<User> => {
  const result = await pool.query<User>(
    `INSERT INTO nx.users (email, password_hash, first_name, last_name, user_role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, password_hash, avatar_url, user_role, first_name, last_name, is_active, is_email_verified, last_login_at, created_at, updated_at`,
    [email, passwordHash, firstName, lastName, userRole]
  )
  return result.rows[0]
}

export const recordLogin = async (userId: string): Promise<void> => {
  await pool.query(
    `UPDATE nx.users
     SET last_login_at = NOW(),
         updated_at = NOW()
     WHERE id = $1
       AND deleted_at IS NULL`,
    [userId]
  )
}
