import { pool } from '../config/db'
import { User } from '../types/user.type'

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query<User>(
    `SELECT id, email, password, password_hash, avatar_url, user_role, first_name, last_name, is_active, is_email_verified, created_at, updated_at
     FROM nx.users
     WHERE email = $1
       AND deleted_at IS NULL`,
    [email]
  )
  return result.rows[0] ?? null
}
