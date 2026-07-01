## Stack

- Node.js with TypeScript (strict mode)
- Express for routing
- PostgreSQL with raw SQL — no ORM, no query builder
- `pg` (node-postgres) as the database driver
- JWT for authentication
- UUID primary keys throughout

---

## Absolute Rules — Never Violate These

- NEVER use an ORM — no Prisma, no TypeORM, no Sequelize, no Knex
- NEVER write raw SQL outside the queries layer
- NEVER put database logic in a controller or service
- NEVER put business logic in a route handler
- NEVER use auto-incrementing integer IDs — always UUID
- NEVER return a password hash or sensitive field in an API response
- NEVER catch an error silently — always log it and return a typed error response
- NEVER use `any` as a type — define the interface

---

## Four Layer Architecture

Every request flows through exactly four layers in this order:

```
Route → Controller → Service → Query
```

Each layer has one responsibility. Nothing crosses the boundary.

### Layer responsibilities

**Route** (`src/routes/`)

- Register the endpoint and HTTP method
- Apply middleware (auth, validation)
- Call the controller
- Nothing else

**Controller** (`src/controllers/`)

- Extract and validate request data
- Call the service
- Format and return the HTTP response
- No SQL, no business logic

**Service** (`src/services/`)

- Business logic only
- Orchestrates one or more query calls
- No SQL, no HTTP concern
- Returns typed domain objects

**Query** (`src/queries/`)

- Raw SQL only
- One function per query
- Returns typed results
- No business logic

---

## File Naming Conventions

```
src/
├── routes/
│   └── user.routes.ts
├── controllers/
│   └── user.controller.ts
├── services/
│   └── user.ervice.ts
├── queries/
│   └── user.queries.ts
├── middleware/
│   ├── authMiddleware.ts
│   └── validateMiddleware.ts
├── types/
│   └── user.ts
├── config/
│   └── db.ts
└── utils/
    └── errors.ts
```

---

## Query Layer Pattern

Every query function follows this pattern exactly:

```ts
// src/queries/userQueries.ts
import { pool } from '../config/db'
import { User } from '../types/user'

export  const findUserById = async (id: string): Promise<User | null> =>{
  const result = await pool.query<User>(
    `SELECT id, email, full_name, role, created_at
     FROM users
     WHERE id = $1
       AND deleted_at IS NULL`,
    [id]
  )
  return result.rows[0] ?? null
}

export async function findUsersPaginated(
  cursor: string | null,
  limit: number
): Promise<User[]> {
  const result = await pool.query<User>(
    `SELECT id, email, full_name, role, created_at
     FROM users
     WHERE deleted_at IS NULL
       AND ($1::uuid IS NULL OR id > $1::uuid)
     ORDER BY id ASC
     LIMIT $2`,
    [cursor, limit]
  )
  return result.rows
}
```

### Query rules

- Select only the columns you need — never `SELECT *`
- Always parameterize values — never string interpolation in SQL
- Always filter `deleted_at IS NULL` for soft-deleted tables
- Return `null` for single row misses — never throw a not-found from the query layer
- Cursor-based pagination only — no `OFFSET`

---

## Service Layer Pattern

```ts
// src/services/userService.ts
import * as userQueries from '../queries/userQueries'
import { User } from '../types/user'
import { NotFoundError } from '../utils/errors'

export async function getUserById(id: string): Promise<User> {
  const user = await userQueries.findUserById(id)
  if (!user) throw new NotFoundError(`User ${id} not found`)
  return user
}
```

---

## Controller Layer Pattern

```ts
// src/controllers/userController.ts
import { Request, Response } from 'express'
import * as userService from '../services/userService'

export async function getUser(req: Request, res: Response): Promise<void> {
  try {
    const user = await userService.getUserById(req.params.id)
    res.json({ data: user })
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
```

---

## Route Layer Pattern

```ts
// src/routes/userRoutes.ts
import { Router } from 'express'
import { getUser } from '../controllers/userController'
import { requireAuth } from '../middleware/authMiddleware'

const router = Router()

router.get('/:id', requireAuth, getUser)

export default router
```

---

## TypeScript Conventions

- Every table has a corresponding interface in `src/types/`
- Every query function has explicit return type annotation
- No `as any` casts anywhere
- Strict null checks — handle null explicitly, never assume a row exists

### Type pattern

```ts
// src/types/user.ts
export interface User {
  id: string           // UUID
  email: string
  full_name: string
  role: 'student' | 'instructor' | 'admin'
  created_at: Date
  deleted_at: Date | null
}
```

---

## Database Conventions

- UUID primary keys — `gen_random_uuid()` as default
- PostgreSQL enums for role/status fields
- Soft deletes via `deleted_at` timestamp — never hard delete user data
- All tables have `created_at` and `updated_at`
- RLS policies enforced at the database level for tenant isolation
- Timestamps stored as `TIMESTAMPTZ` — always UTC

### UUID pattern

```sql
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL UNIQUE,
  full_name   TEXT NOT NULL,
  role        user_role NOT NULL DEFAULT 'student',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ
);
```

---

## Pagination

Cursor-based only — never offset pagination.

```ts
// Standard cursor response shape
interface PaginatedResponse<T> {
  data: T[]
  nextCursor: string | null
  hasMore: boolean
}
```

The cursor is always the `id` of the last row returned. Pass it as a query parameter: `?cursor=uuid&limit=20`.

---

## Error Types

```ts
// src/utils/errors.ts
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}
```

---

## Environment Variables

```
DATABASE_URL=postgresql://user:password@localhost:5432/learnhub
JWT_SECRET=your_secret_here
PORT=3000
FRAUD_API_URL=http://localhost:8001
```

Never access `process.env` directly in business logic — always import from `src/config/`.

---

## What Claude Should Never Do

- Write SQL anywhere outside the queries layer
- Use an ORM or query builder of any kind
- Use `SELECT *` in any query
- Use `OFFSET` for pagination
- Return sensitive fields in API responses
- Catch errors silently without logging
- Use integer IDs for any table
- Skip the four layer boundary for any reason — even for "simple" endpoints.
