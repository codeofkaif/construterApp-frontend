import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from 'react'
import { clearSession, loadSession, type StoredUser } from '../services/authService'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type UserRole = 'CLIENT' | 'ADMIN'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean     // true while hydrating from localStorage
  login: (user: AuthUser) => void
  logout: () => void
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)   // wait for localStorage hydration

  // Hydrate from localStorage on app start (prevents logout on page refresh)
  useEffect(() => {
    const stored: StoredUser | null = loadSession()
    if (stored) {
      setUser({ id: stored.id, name: stored.name, email: stored.email, role: stored.role })
    }
    setIsLoading(false)
  }, [])

  const login = (u: AuthUser) => setUser(u)

  const logout = () => {
    clearSession()   // clears token + user from localStorage
    setUser(null)
  }

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: user !== null, isLoading, login, logout }),
    [user, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
