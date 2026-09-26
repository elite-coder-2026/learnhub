# Offline Lesson Download — Remaining Work

## Backend (this session) — DONE, verified
1. All 12 migrations (including `0012_create_wishlists.sql`) run cleanly against `learnhub_test`; `wishlists` table exists
2. Full integration test suite added: 13 files, 72 tests, `npm test` — real HTTP requests through `app.ts` against a real Postgres DB, no mocks. Covers auth, user, course, enrollment, progress, review, assignment, discussion, notification, admin, certificate, wishlist, download-manifest
3. Along the way, fixed real pre-existing bugs surfaced by testing:
   - `nx.users` (migrations) vs. the columns `user.query.ts`/`auth.query.ts` actually used were two different, incompatible shapes, and those queries pointed at a nonexistent `lh.users` table — register/login were broken against the migrations. Fixed via `0001`/`0004` migrations + query fixes.
   - `0001` had a stray `create database nexus;`, `0002` duplicated `create schema nx;` — both broke a straight-through migration run. Fixed.
   - `discussion.query.ts` selected a nonexistent `u.role` column (should be `u.user_role`) — `GET /lessons/:id/discussion` was 500ing. Fixed.
4. `server.ts` split into `app.ts` (exported Express app) + thin `server.ts` (listener) so tests can hit the app without binding a port.
5. Test infra: `learnhub_test` DB, `.env.test`, `jest.config.js`, `tests/setupEnv.ts`, `tests/helpers.ts`. Your real dev DB (`learnhub`/`lh` schema) was never touched.

## Frontend / PWA (separate session — frontend/CLAUDE.md)
4. Web app manifest (`manifest.json`) for installability
5. Service worker registration + lifecycle handling
6. Service worker fetch handler calling `GET /courses/:id/download-manifest` and caching each `content_url` via the Cache API
7. IndexedDB (or similar) tracking which lessons/courses are downloaded per user, reflected in the UI
8. UI: "Download for offline" control per course/lesson, storage-quota/progress feedback, remove-downloaded-content action
9. Offline fallback logic — serve cached lesson content when the network is unavailable
10. Cache invalidation when an instructor edits a lesson's `content_url`

## Undecided
11. Video/large-file storage strategy — no CDN vs. direct-download distinction has been defined for what actually gets cached offline

