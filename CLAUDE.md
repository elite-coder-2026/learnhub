## What LearnHub Is

LearnHub is a production-grade full-stack SaaS Learning Management System (LMS). It is a portfolio project built to demonstrate senior-level full-stack architecture across three user domains: students, instructors, and admins.

This is not a tutorial project. Every decision reflects production standards.

---

## Monorepo Structure

```
learnhub/
├── CLAUDE.md                  ← you are here
├── frontend/
│   ├── CLAUDE.md              ← React/TypeScript/styled-components conventions
│   └── src/
├── backend/
│   ├── CLAUDE.md              ← four layer architecture/raw SQL conventions
│   └── src/
├── fraud/                     ← Python fraud detection microservice
│   ├── main.py
│   ├── train.py
│   ├── features.py
│   └── requirements.txt
├── database/
│   ├── migrations/
│   └── seeds/
└── .env.example
```

Each domain has its own CLAUDE.md. Always read the domain-specific CLAUDE.md before generating any code for that domain.

---

## Tech Stack

### Frontend

- React 18 + TypeScript (strict)
- Styled-components
- React Query
- React Router v6
- Vite

### Backend

- Node.js + TypeScript (strict)
- Express
- PostgreSQL — raw SQL, no ORM
- node-postgres (pg)
- JWT authentication

### Infrastructure

- PostgreSQL with RLS (Row Level Security)
- Python/FastAPI fraud detection microservice
- Environment-based configuration

---

## Three User Domains

Every feature maps to one of three domains. Always establish which domain a feature belongs to before generating any code.

### Student

- Enroll in courses
- Watch lessons
- Submit assignments
- Track progress

### Instructor

- Create and manage courses
- Upload lessons
- Review submissions
- View enrollment analytics

### Admin

- Manage all users
- Manage all courses
- View platform analytics
- Handle fraud flags

---

## Global Conventions

### Primary Keys

- UUID everywhere — `gen_random_uuid()`
- Never integer IDs on any table for any reason

### Timestamps

- All tables have `created_at TIMESTAMPTZ` and `updated_at TIMESTAMPTZ`
- Always UTC
- Soft deletes via `deleted_at TIMESTAMPTZ` — never hard delete user data

### TypeScript

- Strict mode always
- No `any` anywhere
- Every interface explicitly defined
- Every function has explicit return type annotation

### Environment Variables

- Never access `process.env` directly in business logic
- Always import from the config layer
- Never commit `.env` files
- `.env.example` is the source of truth for required variables

### Git Discipline

- Commit after every verified working unit
- Clear Claude Code context after every commit
- One concern per session — never mix domains in a single Claude Code session

### Error Handling

- Never catch silently
- Always log before returning an error response
- Typed error classes — NotFoundError, UnauthorizedError, ValidationError
- Fail open on third party services — never let a microservice outage take down core functionality

---

## What LearnHub Is Not

- Not an AI-powered platform — no AI features inside the product itself
- Not a monolith — system-level concerns live in separate services
- Not over-engineered — every layer exists because it has a job, not for ceremony

---

## Absolute Global Rules — Never Violate These Regardless of Domain

- NEVER use an ORM anywhere in the backend
- NEVER write SQL outside the queries layer
- NEVER use native `<select>` elements in the frontend
- NEVER use integer primary keys on any table
- NEVER commit `.env` files
- NEVER use `any` as a TypeScript type
- NEVER generate code that crosses the four layer boundary
- NEVER hard delete user records
- NEVER return sensitive fields (password hashes, internal tokens) in API responses
- NEVER use `OFFSET` for pagination — cursor-based only
- NEVER add TODO comments — implement it or leave it out

---

## Session Protocol for Claude Code

1. Read the relevant domain CLAUDE.md before writing any code
2. Establish the data shape explicitly before generating components or queries
3. Generate one unit at a time — route, controller, service, query separately
4. Review output before moving to the next layer
5. Commit after each verified unit
6. Clear context before starting the next session

---

## What Claude Should Never Do

- Mix frontend and backend code in the same output
- Generate code for multiple domains in a single session
- Skip a layer in the four layer architecture for any reason
- Make assumptions about data shapes — always ask if undefined
- Generate placeholder or mock implementations without flagging them clearly
- Deviate from the conventions in the domain-specific CLAUDE.md files