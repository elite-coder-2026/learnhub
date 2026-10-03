# LearnHub Components

Inventory of every frontend component and page, and every backend endpoint with the four layers behind it.

---

## Frontend (`client/src`)

### Pages (`pages/`)

| Page | Route | Access | Purpose |
|---|---|---|---|
| Home | `/` | Public | Landing page: hero, features section, categories, popular courses, top instructors, new courses |
| Login | `/login` | Public | Email + password sign in |
| Register | `/register` | Public | Account sign up with role selection |
| CourseCatalog | `/courses` | Public | Search, level/sort/category filters, course grid, load more |
| CourseDetail | `/courses/:id` | Public | Course info, price, enroll, curriculum |
| Dashboard | `/dashboard` | Logged in | Role-specific dashboard (student, instructor, admin) |
| CreateCourse | `/courses/new` | Instructor | Course details, price, module + lesson builder |
| CoursePlayer | `/courses/:id/learn[/:lessonId]` | Logged in | Lesson content, completion, lesson sidebar |

### Shared components (`components/`)

| Component | Purpose | Used by |
|---|---|---|
| ActivityChart | ECharts bar chart of lessons completed over 7 days | **Unused** (no activity endpoint yet) |
| AppProviders | React Query, theme, global styles, auth, router, error boundary, toasts | `main.tsx` |
| AppShell | Page layout: sidebar, top bar, content area | CourseCatalog, CourseDetail, CoursePlayer, CreateCourse, Dashboard |
| Button | Primary / secondary / ghost / danger button with loading state | CourseCatalog, CourseDetail, CoursePlayer, CreateCourse, Dashboard, Home, CourseCard, EmptyState, ModuleEditor, TopBar |
| Card | Generic bordered card wrapper | **Unused** |
| Container | Centered max-width page container | CourseCatalog, CourseDetail, CoursePlayer, CreateCourse, Dashboard |
| CourseCard | Course tile: cover, level badge, title, description, meta, price, enroll/continue | CourseGrid |
| CourseGrid | Responsive course grid with skeletons and empty state | CourseCatalog, Home |
| CourseProgressCard | "Continue learning" card with progress | Dashboard |
| Dropdown | Custom dropdown (no native `<select>`) | CourseCatalog |
| EmptyState | Icon, message, call-to-action | Dashboard |
| ErrorBoundary | Catches render errors | AppProviders |
| FeaturesSection | Landing page feature cards, driven by `features.config.ts` | Home |
| InlineError | Inline alert message | CourseDetail, CoursePlayer, CreateCourse, Dashboard, Home, CourseCard, CourseGrid |
| Input | Labeled text input with hint and error | CreateCourse, ModuleEditor |
| InstructorCard | Instructor avatar, name, course + student counts | Home |
| LessonList | Lesson sidebar: progress header, collapsible sections, lesson states | CourseDetail, CoursePlayer |
| Modal | Dialog overlay | **Unused** |
| ModuleEditor | One module's title and lesson rows in the course builder | CreateCourse |
| PageHeader | Page title, description, actions | CourseDetail, CreateCourse |
| PasswordInput | Password field with show/hide | **Unused** (Login and Register use their own inputs) |
| ProgressBar | Rounded progress bar | CourseCard, CourseProgressCard, FeaturesSection, LessonList |
| ProtectedRoute | Redirects to login or blocks by role | `router.tsx` |
| RoleGate | Renders children only for given roles | **Unused** |
| SearchInput | Search field with icon and clear button | CourseCatalog |
| Sidebar | Dark nav sidebar with icons and active state | AppShell |
| Skeleton | Loading placeholder block | CourseDetail, CoursePlayer, Dashboard, Home, CourseGrid |
| StatCard | Icon badge, number, label | Dashboard |
| Toast | Toast notifications provider | AppProviders |
| TopBar | Header: sidebar toggle, page title, user avatar/role/log out or log in/sign up | AppShell |

---

## Backend (`backend/`)

Every endpoint flows **Route → Controller → Service → Query**. Files are named `<resource>.routes.ts`, `<resource>.controller.ts`, `<resource>.service.ts`, `<resource>.query.ts`.

### Auth (`/auth`)

| Method | Path | Access |
|---|---|---|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |

### Users (`/users`)

| Method | Path | Access |
|---|---|---|
| GET | `/users/instructors/top` | Public |
| GET | `/users/:id` | Self or admin |
| PUT | `/users/:id` | Self or admin |
| DELETE | `/users/:id` | Self or admin |

### Courses (`/courses`)

| Method | Path | Access |
|---|---|---|
| GET | `/courses` | Public (search, category, level, instructor filters) |
| GET | `/courses/popular` | Public |
| GET | `/courses/:id` | Public |
| POST | `/courses` | Instructor |
| PUT | `/courses/:id` | Instructor |
| GET | `/courses/analytics` | Instructor |
| GET | `/courses/:id/students` | Instructor |
| POST | `/courses/:id/upload-url` | Instructor |
| POST | `/courses/:id/modules` | Instructor |
| PUT | `/courses/modules/:moduleId` | Instructor |
| DELETE | `/courses/modules/:moduleId` | Instructor |
| POST | `/courses/modules/:moduleId/lessons` | Instructor |
| POST | `/courses/modules/:moduleId/lessons/bulk` | Instructor |
| PUT | `/courses/modules/:moduleId/lessons/reorder` | Instructor |
| PUT | `/courses/lessons/:lessonId` | Instructor |
| DELETE | `/courses/lessons/:lessonId` | Instructor |
| POST | `/courses/:id/enroll` | Student |
| GET | `/courses/:id/download-manifest` | Student |
| GET | `/courses/:id/reviews` | Public |
| POST | `/courses/:id/reviews` | Student |
| DELETE | `/courses/:id/reviews` | Student |

### Progress (mounted at `/`)

| Method | Path | Access |
|---|---|---|
| GET | `/dashboard` | Logged in |
| GET | `/lessons/:lessonId` | Logged in |
| POST | `/lessons/:lessonId/complete` | Logged in |
| DELETE | `/lessons/:lessonId/complete` | Logged in |
| GET | `/courses/:courseId/progress` | Logged in |

### Assignments (mounted at `/`)

| Method | Path | Access |
|---|---|---|
| GET | `/courses/:courseId/assignments` | Public |
| POST | `/courses/:courseId/assignments` | Instructor |
| POST | `/assignments/:assignmentId/submit` | Student |
| GET | `/assignments/:assignmentId/my-submission` | Student |
| GET | `/assignments/:assignmentId/submissions` | Instructor |
| PUT | `/submissions/:submissionId/grade` | Instructor |

### Discussion (mounted at `/`)

| Method | Path | Access |
|---|---|---|
| GET | `/lessons/:lessonId/discussion` | Logged in |
| POST | `/lessons/:lessonId/discussion` | Logged in |

### Certificates (`/certificates`)

| Method | Path | Access |
|---|---|---|
| GET | `/certificates` | Logged in |
| GET | `/certificates/:id/download` | Logged in |

### Notifications (`/notifications`)

| Method | Path | Access |
|---|---|---|
| GET | `/notifications` | Logged in |
| GET | `/notifications/unread-count` | Logged in |
| PUT | `/notifications/read-all` | Logged in |
| PUT | `/notifications/:id/read` | Logged in |
| DELETE | `/notifications/:id` | Logged in |

### Wishlist (`/wishlist`)

| Method | Path | Access |
|---|---|---|
| GET | `/wishlist` | Logged in |
| POST | `/wishlist/:courseId` | Logged in |
| DELETE | `/wishlist/:courseId` | Logged in |

### Admin (`/admin`, all admin only)

| Method | Path |
|---|---|
| GET | `/admin/users` |
| PUT | `/admin/users/:id/deactivate` |
| GET | `/admin/courses` |
| DELETE | `/admin/courses/:id` |
| GET | `/admin/analytics` |
| GET | `/admin/fraud-flags` |
| PUT | `/admin/fraud-flags/:id/review` |

### Supporting backend modules

| Module | Purpose |
|---|---|
| `middleware/authMiddleware.ts` | `requireAuth`, `requireRole`, `requireSelfOrAdmin` |
| `config/env.ts`, `config/db.ts` | Environment config and Postgres pool |
| `queries/search.queries.ts` | Ranked full-text course search |
| `queries/transaction.query.ts` | `withTransaction` helper |
| `utils/errors.ts` | `NotFoundError`, `UnauthorizedError`, `ValidationError` |
| `utils/fraudClient.ts` | Fraud service client (fails open) |
| `utils/mailer.ts` | Email sending |
| `utils/certificateGenerator.ts` | Certificate PDF generation |
| `utils/storage.ts` | S3 presigned upload/download URLs |
| `database/seeds/seed.ts` | Idempotent dev seed |
| `scripts/cleanupFixtureCourses.ts` | Soft-deletes leftover test fixture courses |
