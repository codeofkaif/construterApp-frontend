import { Navigate } from 'react-router-dom'
import { useAuth, type UserRole } from '../context/AuthContext'
import type { ReactNode } from 'react'

type ProtectedRouteProps = {
  children: ReactNode
  requiredRole?: UserRole
}

/**
 * ProtectedRoute — guards a route by authentication and optional role check.
 *
 * Redirect logic:
 *  1. Auth still hydrating from localStorage → show nothing (prevents flicker)
 *  2. Not authenticated            → /login
 *  3. Authenticated, wrong role    → /dashboard
 *  4. Authenticated, correct role  → render children
 */
export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()

  // Wait until localStorage hydration is done to avoid redirect flicker
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-dark">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-gold border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
