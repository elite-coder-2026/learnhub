import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import type { UserRole } from '../../types/auth'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: UserRole[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/forbidden" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
