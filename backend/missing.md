# Missing / Outstanding Work

Current verified state: 14 test suites, 77 tests, all passing (`npm test`). `npx tsc --noEmit` clean.

## Runtime / environment
1. ~~Real dev DB was stale~~ — DONE. `nexus` database rebuilt from the current migration chain, `.env` now points at it, real server (`npm start`) verified booting and serving `GET /courses` → 200 against it.
1b. ~~`JWT_SECRET` line-wrap bug~~ — DONE. Fixed to a single line in `.env`, server reverified booting.
2. ~~No seed script~~ — DONE. `npm run seed` (`database/seeds/seed.ts`) creates an admin/instructor/student, a course with modules/lessons, and an enrollment via the real service layer (not raw SQL). Verified against `nexus`.
3. No CI — tests only run when invoked manually via `npm test`. Not a cost blocker: GitHub Actions is free for public repos (unlimited) and free for private repos up to 2,000 min/month, far more than this suite would use. Also moot right now since this directory isn't a git repo yet.
4. ~~No lint config~~ — DONE. `eslint.config.js` + `npm run lint`, strict TS rules (`no-explicit-any` as error). Fixing lint warnings surfaced two more instances of the same `role`→should-be-`user_role` regression from earlier (`queries/analytics.query.ts`) — fixed, verified against the full test suite.

## S3 / object storage
5. Only the **upload** side is wired to an endpoint (`POST /courses/:id/upload-url`). `getLessonContentDownloadUrl` in `utils/storage.ts` is dead code — nothing calls it. There's no endpoint or flow that turns an uploaded S3 `key` back into a playable/downloadable URL, and lessons still store `content_url` as a plain string unrelated to S3 keys.
6. No real AWS account/bucket exists. Everything was verified against local presigned-URL generation (a pure signing operation, no network call) with fake credentials — never tested against a real bucket, so real upload/download behavior is unverified.
7. No decision made on how `content_url` and S3 `key` relate going forward (store key vs. URL, when to sign, cache duration for the offline-download feature from earlier in this session).

## Test coverage gaps
8. Fraud-flag *creation* is untested end-to-end — only tested via direct SQL fixture + admin review. The real `evaluateEnrollmentForFraud` → fraud microservice path is never exercised (nothing listens on `FRAUD_API_URL` in test env).
9. `getStudentDashboard`'s "completed" bucket is untested — only the empty-dashboard case is covered. Never verified a finished course actually appears as completed.
10. No test exercises cursor/pagination beyond a single page on any list endpoint (courses, users, submissions, notifications, etc.).

## Frontend
11. PWA offline-download frontend (service worker, manifest.json, IndexedDB, UI) — untouched per explicit instruction not to touch the frontend. Backend endpoint (`GET /courses/:id/download-manifest`) exists and is tested.
