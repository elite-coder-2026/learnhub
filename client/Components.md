# LearnHub Components

## CoursePlayer

Parent coordinator that owns all playlist state and makes all API calls via TanStack Query. Holds `currentIndex` and `isTransitioning`. Renders `VideoPlayer` and `Playlist` as children.

## VideoPlayer

Pure renderer. Props: `src`, `lastPosition`, `onProgress`, `onComplete`. Remounts clean on track change via `key={currentTrack.id}`. Saves progress every 5 seconds and on pause. Never decides what plays next.

## Playlist

Displays track list as a scrollable sidebar. Each track renders: lesson title, runtime, and a `has_watched` completion indicator. Active track is visually distinct. Receives `currentIndex`, `playlist`, `onSelect` from `CoursePlayer` as props.

## Login

Email and password fields with controlled inputs. Inline field level validation errors beneath each input. Submits credentials, stores auth token on success, redirects to dashboard. Password field has show/hide toggle.

## Register

Email, password, and confirm password fields. Validates passwords match client side before submitting. Shows inline error if they don't match. Redirects to login on success.

## CourseCatalog

Displays courses as a responsive card grid. Each card renders: thumbnail, title, instructor name, formatted runtime, lesson count, price, and enrollment status badge. Enrolled courses show a progress bar. Unenrolled courses show an enroll button. Cursor-based pagination via TanStack Query with a load more button.

## Rules

- `CoursePlayer` owns all state, `VideoPlayer` and `Playlist` are dumb
- `has_watched` is a one-way boolean, never reverted
- Save progress before advancing tracks, never after
- Transition lock prevents race conditions on rapid clicks
- No native select elements anywhere
- No HTML form elements, use controlled inputs with onClick handlers

Generate all six components with their styles files.