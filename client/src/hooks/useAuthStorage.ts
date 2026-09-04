import { useMemo } from 'react'

const TOKEN_KEY = 'learnhub_token'

interface AuthStorage {
  readToken: () => string | null
  writeToken: (token: string) => void
  clearToken: () => void
}

export function useAuthStorage(): AuthStorage {
  return useMemo<AuthStorage>(
    () => ({
      readToken: (): string | null => {
        try {
          return localStorage.getItem(TOKEN_KEY)
        } catch {
          return null
        }
      },
      writeToken: (token: string): void => {
        try {
          localStorage.setItem(TOKEN_KEY, token)
        } catch {
          // storage unavailable (private mode, quota, etc.) — session stays in-memory only
        }
      },
      clearToken: (): void => {
        try {
          localStorage.removeItem(TOKEN_KEY)
        } catch {
          // storage unavailable — nothing to clear
        }
      },
    }),
    [],
  )
}
