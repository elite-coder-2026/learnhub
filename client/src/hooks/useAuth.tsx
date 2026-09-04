import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { useAuthStorage } from './useAuthStorage'
import { parseJwtPayload } from '../utils/jwt'
import type { AccessTokenPayload, AuthUser } from '../types/auth'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps): React.ReactElement {
  const storage = useAuthStorage()
  const [token, setToken] = useState<string | null>(() => storage.readToken())

  const login = useCallback(
    (nextToken: string): void => {
      storage.writeToken(nextToken)
      setToken(nextToken)
    },
    [storage],
  )

  const logout = useCallback((): void => {
    storage.clearToken()
    setToken(null)
  }, [storage])

  const user = useMemo<AuthUser | null>(() => {
    if (!token) return null
    const payload = parseJwtPayload<AccessTokenPayload>(token)
    if (!payload) return null
    return { userId: payload.sub, role: payload.role }
  }, [token])

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, isAuthenticated: user !== null, login, logout }),
    [user, token, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- useAuth must live alongside AuthProvider/AuthContext
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
