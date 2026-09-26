import { Pool } from 'pg'

const connectionString: string | undefined = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

export const pool = new Pool({ connectionString })

pool.on('error', (error: Error) => {
  console.error('Unexpected error on idle PostgreSQL client', error)
})
