## Stack

- React 18 with TypeScript (strict mode)
- Styled-components for all styling
- React Query for server state
- React Router v6 for routing
- Vite as the build tool

---

## Absolute Rules — Never Violate These

- NEVER use native `<select>` elements — always build custom dropdown components using `div`, `useState`, and a click-outside handler
- NEVER output a naked/unwrapped component — every component renders inside a container with `padding`, `border`, and `border-radius`
- NEVER hardcode colors, spacing, or font sizes inline — always use theme tokens
- NEVER use `any` as a type — define the interface
- NEVER put business logic in a component — it belongs in a custom hook or service
- NEVER use `localStorage` or `sessionStorage` directly in a component — abstract it
- NEVER create a new file without the per-component folder structure below

---

## Component Structure

Every component lives in its own folder:

```
src/components/ComponentName/
├── index.tsx
└── ComponentName.styles.ts
```

`index.tsx` — logic, JSX, props interface `ComponentName.styles.ts` — all styled-components for that component

### index.tsx pattern

```tsx
import React from 'react'
import * as S from './ComponentName.styles'

interface ComponentNameProps {
  // always define props explicitly — never use any
}

const ComponentName: React.FC<ComponentNameProps> = ({ }) => {
  return (
    <S.Container>
      {/* content */}
    </S.Container>
  )
}

export default ComponentName
```

### ComponentName.styles.ts pattern

```ts
import styled from 'styled-components'

export const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`
```

---

## Styled-Components Conventions

- Always import as `import * as S from './ComponentName.styles'`
- All transient props (not forwarded to DOM) use `$` prefix: `$isActive`, `$variant`, `$size`
- Never use inline styles — if it needs styling it gets a styled-component
- Never use CSS class names — styled-components only
- Theme tokens for everything — no magic numbers

### Transient prop pattern

```tsx
// In styles
export const Button = styled.button<{ $isActive: boolean }>`
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary : theme.colors.surface};
`

// In component
<S.Button $isActive={isActive} onClick={handleClick}>
```

---

## Custom Dropdown — Required Pattern

Never use `<select>`. Every dropdown is built like this:

```tsx
const [isOpen, setIsOpen] = useState(false)
const ref = useRef<HTMLDivElement>(null)

useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setIsOpen(false)
    }
  }
  document.addEventListener('mousedown', handleClickOutside)
  return () => document.removeEventListener('mousedown', handleClickOutside)
}, [])
```

---

## TypeScript Conventions

- Every component has an explicit props interface above the component
- Every API response has a typed interface in `src/types/`
- Every custom hook has explicit return type annotation
- No `as any` casts — if you need to cast, define the type properly
- Strict null checks — always handle the null/undefined case explicitly

### Column interface pattern for data tables

```ts
interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  pinned?: 'left' | 'right'
  width?: number
  render?: (value: T[keyof T], row: T) => React.ReactNode
}
```

---

## Data Table Conventions

- Server-side pagination only — never load full datasets client side
- Cursor-based pagination preferred over offset for large datasets
- Per-column filtering with debounced input (300ms)
- Column pinning support via `pinned: 'left' | 'right'`
- Virtual scrolling for rows exceeding 100 visible items
- Loading skeleton rows — never a spinner over existing data

---

## API Layer

All API calls go through `src/services/` — never fetch directly in a component.

```ts
// src/services/userService.ts
import { API_URL } from '../config/api'
import { User } from '../types/user'

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/api/users`)
  if (!response.ok) throw new Error('Failed to fetch users')
  return response.json()
}
```

Environment variable for API base URL:

```ts
// src/config/api.ts
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
```

---

## Folder Structure

```
src/
├── components/          # shared reusable components
│   └── ComponentName/
│       ├── index.tsx
│       └── ComponentName.styles.ts
├── pages/               # route-level components
│   └── PageName/
│       ├── index.tsx
│       └── PageName.styles.ts
├── hooks/               # custom hooks
├── services/            # API calls
├── types/               # TypeScript interfaces
├── config/              # env config
├── theme/               # theme tokens
└── utils/               # pure utility functions
```

---

## Error Handling

- Every component that fetches data has three states: loading, error, success
- Loading state uses skeleton components — never raw spinners over content
- Error state renders an inline error message — never a full page error for partial failures
- Null/undefined data is handled before render — never assume data exists

---

## What Claude Should Never Do

- Generate a component without its styles file
- Use a native select element for any reason
- Output unwrapped JSX — always wrapped in a container
- Use `Math.random()` for keys — always use the data's UUID
- Add TODO comments — either implement it or leave it out
- Generate barrel files (index.ts re-exports) unless explicitly asked