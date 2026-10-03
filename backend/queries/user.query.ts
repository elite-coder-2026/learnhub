import { pool } from '../config/db'
import { User } from '../types/user.type'

export const findUserById = async (id: string): Promise<User | null> => {
  const result = await pool.query<User>(
    `SELECT id, email, password_hash, avatar_url, user_role, first_name, last_name, is_active, is_email_verified, last_login_at, created_at, updated_at
     FROM nx.users
     WHERE id = $1
       AND deleted_at IS NULL`,
    [id]
  )
  return result.rows[0] ?? null
}

export const findUsersPaginated = async (cursor: string | null, limit: number): Promise<User[]> => {
  const result = await pool.query<User>(
    `SELECT id, email, password_hash, avatar_url, user_role, first_name, last_name, is_active, is_email_verified, last_login_at, created_at, updated_at
     FROM nx.users
     WHERE deleted_at IS NULL
       AND ($1::uuid IS NULL OR id > $1::uuid)
     ORDER BY id ASC
     LIMIT $2`,
    [cursor, limit]
  )
  return result.rows
}

export const updateUser = async (
  id: string,
  firstName: string,
  lastName: string,
  userRole: string
): Promise<User | null> => {
  const result = await pool.query<User>(
    `UPDATE nx.users
     SET first_name = $2,
         last_name = $3,
         user_role = $4,
         updated_at = NOW()
     WHERE id = $1
       AND deleted_at IS NULL
     RETURNING id, email, password_hash, avatar_url, user_role, first_name, last_name, is_active, is_email_verified, last_login_at, created_at, updated_at`,
    [id, firstName, lastName, userRole]
  )
  return result.rows[0] ?? null
}

export const deleteUser = async (id: string): Promise<void> => {
  await pool.query(
    `UPDATE nx.users
     SET deleted_at = NOW(),
         is_active = false,
         updated_at = NOW()
     WHERE id = $1
       AND deleted_at IS NULL`,
    [id]
  )
}
