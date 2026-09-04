# LearnHub Frontend — Component Inventory

Scope: derived from `client/CLAUDE.md` conventions and the three user domains defined in the root `CLAUDE.md` (student, instructor, admin). No backend code was inspected — data shapes here are placeholders to be confirmed against the API before implementation.

## Conventions that shape this list

- **`src/pages/<Name>/`** — route-level screens (one folder, `index.tsx` + `<Name>.styles.ts`).
- **`src/components/<Name>/`** — shared, reusable components (same folder rule).
- No native `<select>` — every dropdown is the custom click-outside pattern.
- Every component renders inside a wrapper with `padding` / `border` / `border-radius`.
- Three data states everywhere data is fetched: loading (skeleton), error (inline), success.
- Theme tokens only; transient props prefixed `$`.
- Business logic lives in `src/hooks/` or `src/services/`, never in a component.

---

## 1. App infrastructure

| Component / module | Location | Purpose |
|---|---|---|
| `AppProviders` | `src/components/AppProviders/` | Wraps `QueryClientProvider` + styled-components `ThemeProvider` + `RouterProvider`. |
| `theme` | `src/theme/index.ts` | Design tokens: `colors`, `spacing`, `borderRadius`, `fontSizes`. |
| `styled.d.ts` | `src/theme/styled.d.ts` | Augments `DefaultTheme` so `theme` is typed in styled-components. |
| `router` | `src/router.tsx` | Route table, grouped by domain, with guarded route wrappers. |
| `ProtectedRoute` | `src/components/ProtectedRoute/` | Redirects unauthenticated users; checks role for domain routes. |
| `RoleGate` | `src/components/RoleGate/` | Renders children only if the current user has an allowed role. |
| `ErrorBoundary` | `src/components/ErrorBoundary/` | Catches render errors, shows a recoverable fallback. |
| `config/api.ts` | `src/config/` | `API_URL` from `VITE_API_URL`. |
| `useAuth` | `src/hooks/useAuth.ts` | Current user, token, login/logout; abstracts token storage. |
| `useAuthStorage` | `src/hooks/useAuthStorage.ts` | The only place `localStorage`/`sessionStorage` is touched. |

---

## 2. Shared primitives (`src/components/`)

| Component | Notes |
|---|---|
| `Button` | Variants (`$variant`: primary / secondary / ghost / danger), `$size`, loading state, `disabled`. |
| `IconButton` | Icon-only button with accessible label. |
| `Input` | Text/email/password/number; `$hasError`, label, hint, error slot. |
| `TextArea` | Multi-line; character count option. |
| `PasswordInput` | `Input` + show/hide toggle + optional strength meter. |
| `Checkbox` | Custom-styled, no native appearance reliance. |
| `RadioGroup` | Custom radio set. |
| `Toggle` / `Switch` | Boolean control. |
| `Dropdown` | **Required custom pattern** — `useState` + `useRef` + click-outside. Single-select. |
| `MultiSelect` | Same pattern, multiple values as chips. |
| `Combobox` | Dropdown with typeahead filtering. |
| `DatePicker` | Custom calendar popover (no native `<input type=date>` reliance). |
| `FileUpload` | Drag-and-drop + click, progress, type/size validation. |
| `Modal` / `Dialog` | Focus trap, `Esc` to close, backdrop click, no `window.confirm`. |
| `ConfirmDialog` | Modal preset for destructive actions. |
| `Drawer` | Slide-in panel (filters, detail views). |
| `Tooltip` | Hover/focus popover. |
| `Popover` | Generic anchored floating content. |
| `Toast` / `ToastProvider` | Transient notifications, queue, auto-dismiss. |
| `Tabs` | Accessible tab list + panels. |
| `Accordion` | Collapsible sections. |
| `Breadcrumbs` | Route trail. |
| `Pagination` / `CursorPager` | Cursor-based next/prev controls (no page numbers / offset). |
| `Badge` | Status pills (`$variant`). |
| `Tag` / `Chip` | Removable labels. |
| `Avatar` | Image with initials fallback. |
| `ProgressBar` | Linear determinate/indeterminate. |
| `ProgressRing` | Circular progress for course completion. |
| `Card` | Base wrapped container (satisfies the "always wrapped" rule). |
| `EmptyState` | Illustration + message + optional CTA. |
| `InlineError` | The standard inline error message block. |
| `Skeleton` | Base shimmer block. |
| `SkeletonText` / `SkeletonCard` / `SkeletonTableRow` | Composed loaders — never a spinner over content. |
| `Spinner` | Allowed only for full-screen / first-load, not over existing data. |
| `StatCard` | Single metric with label, value, delta. |
| `SearchInput` | Debounced (300ms) text input with clear button. |
| `Rating` | Star display + input variant. |
| `VideoPlayer` | Wrapper around the player lib: progress events, resume position, playback speed. |
| `MarkdownRenderer` | Renders lesson/description content safely. |
| `CodeBlock` | Syntax-highlighted, copy button. |

---

## 3. Layout (`src/components/`)

| Component | Notes |
|---|---|
| `AppShell` | Top-level grid: sidebar + header + content. |
| `Sidebar` | Domain-aware navigation; collapsible. |
| `SidebarNavItem` | Active-route aware link. |
| `TopBar` / `Header` | Search, notifications bell, user menu. |
| `UserMenu` | Dropdown: profile, settings, logout. |
| `NotificationsMenu` | Bell dropdown with unread list. |
| `PageHeader` | Title, description, action buttons, breadcrumbs. |
| `ContentContainer` | Max-width, padded page body wrapper. |
| `Footer` | Marketing/public pages. |
| `PublicNav` | Nav for logged-out marketing pages. |

---

## 4. Auth pages (`src/pages/`)

| Page | Components used |
|---|---|
| `Register` | `Input`, `PasswordInput`, `Dropdown` (role), `Button`, `InlineError`. **(exists)** |
| `Login` | `Input`, `PasswordInput`, `Button`, `InlineError`, "remember me" `Checkbox`. |
| `ForgotPassword` | `Input`, `Button`, success `EmptyState`. |
| `ResetPassword` | `PasswordInput` x2, `Button`, token from URL. |
| `VerifyEmail` | Status screen (`Spinner` → success/error). |
| `AuthLayout` | Split-panel shell shared by all auth pages. |

Hooks/services: `useRegister` **(exists)**, `useLogin`, `useForgotPassword`, `useResetPassword`, `authService` **(exists — extend)**.

---

## 5. Student domain

### Pages (`src/pages/`)

| Page | Purpose |
|---|---|
| `StudentDashboard` | Continue-learning row, progress summary, upcoming deadlines. |
| `CourseCatalog` | Browsable/filterable course grid, cursor-paged. |
| `CourseDetail` | Syllabus, instructor, reviews, enroll CTA. |
| `CoursePlayer` | Lesson video + lesson list + notes + mark-complete. |
| `MyCourses` | Enrolled courses with progress. |
| `AssignmentView` | Prompt, attachments, submission form. |
| `SubmissionHistory` | Past attempts, grades, feedback. |
| `ProgressOverview` | Per-course completion, streaks, certificates. |
| `StudentProfile` | Personal info, avatar, password change. |
| `Settings` | Notifications, preferences. |

### Feature components (`src/components/`)

| Component | Notes |
|---|---|
| `CourseCard` | Thumbnail, title, instructor, rating, price/enrolled state. |
| `CourseGrid` | Responsive grid + skeleton + empty state. |
| `CatalogFilters` | Category `MultiSelect`, level `Dropdown`, price range, `SearchInput`. |
| `EnrollButton` | Handles enroll/unenroll mutation + states. |
| `LessonList` | Sections → lessons, completion checkmarks, current-lesson highlight. |
| `LessonListItem` | Title, duration, lock/complete icon. |
| `LessonNotes` | Per-lesson notes editor (`TextArea`, autosave). |
| `MarkCompleteButton` | Toggles lesson completion. |
| `CourseProgressCard` | `ProgressRing` + next lesson + resume button. |
| `AssignmentSubmissionForm` | `TextArea` + `FileUpload` + submit. |
| `SubmissionStatusBadge` | draft / submitted / graded / late. |
| `GradeFeedbackPanel` | Score, rubric, instructor comments. |
| `CertificateCard` | Downloadable certificate preview. |
| `ReviewForm` | `Rating` + `TextArea`. |
| `ReviewList` | Paginated reviews with author `Avatar`. |
| `DeadlineList` | Upcoming assignment due dates. |
| `StreakWidget` | Learning streak calendar. |

### Hooks

`useCourses`, `useCourse`, `useEnroll`, `useLessons`, `useLessonProgress`, `useSubmitAssignment`, `useSubmissions`, `useCourseProgress`, `useCertificates`, `useReviews`.

---

## 6. Instructor domain

### Pages (`src/pages/`)

| Page | Purpose |
|---|---|
| `InstructorDashboard` | Revenue, active students, recent submissions, ratings. |
| `InstructorCourses` | Table of owned courses, status, enrollment counts. |
| `CourseEditor` | Create/edit course metadata (multi-step). |
| `CurriculumBuilder` | Drag-to-reorder sections & lessons. |
| `LessonEditor` | Upload video, attachments, description, preview flag. |
| `SubmissionsQueue` | All pending submissions across courses, filterable. |
| `SubmissionReview` | View one submission, grade, leave feedback. |
| `CourseAnalytics` | Enrollment over time, completion funnel, drop-off by lesson. |
| `StudentRoster` | Enrolled students per course, progress, last active. |
| `InstructorProfile` | Public bio, expertise, avatar. |
| `PayoutsSettings` | Payout method (placeholder until backend confirmed). |

### Feature components (`src/components/`)

| Component | Notes |
|---|---|
| `CourseFormFields` | Title, subtitle, category `Dropdown`, level `Dropdown`, price, `MarkdownEditor`, thumbnail `FileUpload`. |
| `MarkdownEditor` | Textarea + toolbar + live preview. |
| `CurriculumTree` | Sections + lessons, add/remove/reorder (drag handle). |
| `SectionRow` / `LessonRow` | Editable inline rows. |
| `VideoUploadCard` | Upload progress, replace, processing status. |
| `CoursePublishToggle` | draft ↔ published with validation gate. |
| `SubmissionsTable` | `DataTable` instance: student, course, submitted-at, status. |
| `GradingPanel` | Score input, rubric checklist, feedback `TextArea`, next/prev. |
| `RubricEditor` | Define criteria + point values. |
| `EnrollmentChart` | Time-series line chart. |
| `CompletionFunnel` | Funnel/bar viz by lesson. |
| `LessonDropoffTable` | Per-lesson view/complete counts. |
| `RosterTable` | `DataTable`: student, progress %, last active, grade avg. |
| `StatCardRow` | Dashboard KPI row. |
| `RevenueChart` | Earnings over time. |

### Hooks

`useInstructorCourses`, `useCourseMutations` (create/update/publish), `useCurriculum`, `useLessonUpload`, `usePendingSubmissions`, `useGradeSubmission`, `useCourseAnalytics`, `useRoster`.

---

## 7. Admin domain

### Pages (`src/pages/`)

| Page | Purpose |
|---|---|
| `AdminDashboard` | Platform KPIs: users, courses, revenue, open fraud flags. |
| `UsersAdmin` | All users table: search, role filter, status, actions. |
| `UserDetailAdmin` | One user: profile, enrollments, activity, suspend/reactivate. |
| `CoursesAdmin` | All courses table: owner, status, enrollments, take down. |
| `CourseDetailAdmin` | Moderate a course, view reports. |
| `PlatformAnalytics` | Growth, retention, revenue, category breakdowns. |
| `FraudFlags` | Queue of flagged events from the fraud service. |
| `FraudFlagDetail` | Signal breakdown, score, resolve / dismiss / escalate. |
| `AuditLog` | System actions log, filterable. |
| `AdminSettings` | Feature flags, platform config. |

### Feature components (`src/components/`)

| Component | Notes |
|---|---|
| `DataTable` | **Core admin component.** Server-side + cursor pagination, per-column debounced (300ms) filters, sortable headers, column pinning (`pinned: 'left' \| 'right'`), virtual scroll >100 rows, skeleton rows. Generic `Column<T>` interface. |
| `DataTableToolbar` | Global search, bulk actions, column visibility `MultiSelect`. |
| `ColumnFilter` | Per-column filter input/select. |
| `BulkActionBar` | Appears on row selection. |
| `RowActionsMenu` | Per-row `Dropdown` (view / suspend / delete-soft). |
| `UserStatusBadge` | active / suspended / unverified. |
| `RoleBadge` | student / instructor / admin. |
| `SuspendUserDialog` | `ConfirmDialog` + reason `TextArea`. |
| `FraudScoreGauge` | 0–100 risk gauge with threshold bands. |
| `FraudSignalList` | Individual signals + weights contributing to score. |
| `FraudFlagStatusBadge` | open / resolved / dismissed / escalated. |
| `ResolveFlagPanel` | Decision `Dropdown` + notes + submit. |
| `AnalyticsFilters` | Date range `DatePicker`, granularity `Dropdown`, segment `MultiSelect`. |
| `MetricChart` | Reusable line/bar/area chart wrapper. |
| `CategoryBreakdown` | Distribution bar/pie. |
| `AuditLogTable` | `DataTable`: actor, action, target, timestamp. |
| `KpiGrid` | Dashboard stat grid. |

### Hooks

`useUsersAdmin`, `useUserAdmin`, `useSuspendUser`, `useCoursesAdmin`, `useModerateCourse`, `usePlatformAnalytics`, `useFraudFlags`, `useResolveFraudFlag`, `useAuditLog`.

---

## 8. Cross-cutting / marketing (optional, public)

| Page | Notes |
|---|---|
| `Landing` | Hero, feature sections, CTA. |
| `Pricing` | Plan comparison. |
| `About` / `Contact` | Static content. |
| `NotFound` (404) | `EmptyState` + home link. |
| `Forbidden` (403) | Shown by `RoleGate` / `ProtectedRoute`. |
| `ErrorPage` (500) | Fallback for `ErrorBoundary`. |

---

## 9. Types (`src/types/`)

One interface file per resource, confirmed against the API before use:
`auth.ts` **(exists)**, `user.ts`, `course.ts`, `lesson.ts`, `enrollment.ts`, `assignment.ts`, `submission.ts`, `progress.ts`, `review.ts`, `certificate.ts`, `analytics.ts`, `fraud.ts`, `notification.ts`, `pagination.ts` (`PaginatedResponse<T>`, `CursorParams`).

---

## 10. Services (`src/services/`)

One module per resource, all `fetch` calls centralized here:
`authService` **(exists)**, `userService`, `courseService`, `lessonService`, `enrollmentService`, `assignmentService`, `submissionService`, `progressService`, `reviewService`, `certificateService`, `analyticsService`, `fraudService`, `notificationService`.

---

## Build order suggestion

1. Infra: `theme`, `AppProviders`, `config/api`, `useAuth` + storage abstraction, router + `ProtectedRoute`.
2. Primitives: `Button`, `Input`, `PasswordInput`, `Dropdown`, `Card`, `InlineError`, `Skeleton`, `Modal`, `Toast`.
3. Layout: `AppShell`, `Sidebar`, `TopBar`, `PageHeader`.
4. Auth pages (`Register` done → `Login` next).
5. Student domain (largest surface, core product loop).
6. Instructor domain.
7. `DataTable` + admin domain.
8. Marketing/public + error pages.
