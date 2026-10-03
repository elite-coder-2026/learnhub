# LearnHub

> **Full-Stack SaaS Learning Management System**  
> Built with **React 18**, **TypeScript**, **Express**, **PostgreSQL**, raw parameterized SQL, and a **FastAPI** fraud detection microservice.

[![TypeScript](https://img.shields.io/badge/typescript-strict-blue.svg)](https://www.typescriptlang.org/)
[![Frontend](https://img.shields.io/badge/frontend-React%2018-61dafb.svg)](https://react.dev/)
[![Backend](https://img.shields.io/badge/backend-Express-green.svg)](https://expressjs.com/)
[![Database](https://img.shields.io/badge/database-PostgreSQL-blue.svg)](https://www.postgresql.org/)
[![Microservice](https://img.shields.io/badge/fraud-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)

**LearnHub** is a production-grade learning management system that serves three user domains: **students**, **instructors**, and **admins**. The backend uses no ORM. Every query is hand-written, parameterized SQL that runs directly against PostgreSQL. A strict four-layer architecture (route → controller → service → query) keeps responsibilities separated. Fraud scoring runs in a separate Python service, and the platform keeps working if that service goes down.

---

## Key Capabilities & Features

* **Three-Domain Role Model:** Students, instructors, and admins log in with JWT authentication. Role-based access control is enforced on every route.
* **Course Authoring:** Instructors create and edit courses with modules and lessons. Media is stored in S3 and served through presigned URLs.
* **Learning Experience:** Students browse, search, and filter the course catalog, enroll, and watch lessons in a dedicated player. Progress is tracked per lesson and per course, with automatic and manual completion.
* **Assignments & Grading:** Students submit assignments. Instructors review and grade them in a submissions workspace.
* **Engagement:** Per-lesson discussions, course reviews, wishlists, and email notifications sent over SMTP.
* **Certificates:** PDF certificates of completion are generated when a student finishes a course.
* **Admin Console:** Admins manage users and courses (soft delete only) and review fraud flags.
* **Fraud Detection:** A scikit-learn model in a FastAPI microservice scores enrollment and payment patterns. The integration fails open, so an outage never blocks core functionality.
* **Zero-ORM Data Layer:** All SQL lives in `backend/queries/`, uses UUID primary keys and cursor-based pagination, and never uses `OFFSET`.

---

## Tech Stack & Architecture

| Layer | Technology | Key Responsibility |
| :--- | :--- | :--- |
| **Frontend** | React 18 / TypeScript / Vite | SPA, routing via React Router v6, server state via React Query |
| **Styles & UI** | styled-components / MUI / ECharts | Themed components, dashboards, and analytics charts |
| **Backend API** | Node.js / Express / TypeScript | Four-layer REST API, JWT auth middleware, typed error classes |
| **Database** | PostgreSQL / node-postgres (`pg`) | Raw parameterized SQL, RLS, UUID keys, soft deletes, SQL migrations |
| **Storage & Email** | AWS S3 / Nodemailer / PDFKit | Lesson media, notification emails, certificate generation |
| **Fraud Service** | Python / FastAPI / scikit-learn | Feature extraction, model training, risk scoring API |
| **Testing** | Jest / Vitest / Playwright | Backend unit tests, frontend unit tests, end-to-end flows |

---

## Project Layout

```text
backend/
├── server.ts          # Entry point, HTTP server bootstrap
├── app.ts             # Express app setup, middleware, router registration
├── config/            # Environment loading (env.ts) and pg pool (db.ts)
├── middleware/        # JWT authentication and role guards
├── routes/            # Route definitions per domain (auth, courses, admin, ...)
├── controllers/       # Request parsing, response shaping
├── services/          # Business logic (enrollment, progress, certificates, fraud, storage)
├── queries/           # Pure parameterized SQL statements per domain
├── types/             # Shared TypeScript interfaces
├── utils/             # Typed error classes and helpers
├── database/
│   ├── migrations/    # Ordered raw SQL migration scripts
│   └── seeds/         # Local development seed data
└── tests/             # Jest test suites
client/
├── src/
│   ├── main.tsx       # React entry point
│   ├── router.tsx     # Route tree and role-gated routes
│   ├── pages/         # Dashboard, CourseCatalog, CoursePlayer, Admin*, ...
│   ├── components/    # Reusable styled-components UI
│   ├── hooks/         # React Query hooks
│   ├── services/      # API client layer
│   ├── theme/         # Design tokens and theming
│   └── types/         # Frontend data contracts
└── e2e/               # Playwright end-to-end tests
fraud/
├── main.py            # FastAPI scoring endpoint
├── features.py        # Feature engineering
├── train.py           # Model training pipeline
└── requirements.txt   # Python dependencies
```

---

## Getting Started

```bash
# Backend
cd backend
npm install
cp .env.example .env      # set DATABASE_URL, JWT_SECRET, SMTP_*, FRAUD_API_URL
npm run seed
npm start

# Frontend
cd client
npm install
npm run dev

# Fraud service
cd fraud
pip install -r requirements.txt
python train.py
uvicorn main:app --reload
```

### Tests

```bash
cd backend && npm test          # Jest
cd client && npm test           # Vitest
cd client && npm run test:e2e   # Playwright
```
