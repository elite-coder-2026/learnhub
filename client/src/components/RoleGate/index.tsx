import type { ReactNode } from 'react'
import { useAuth } from '../../hooks/useAuth'
import type { UserRole } from '../../types/auth'

interface RoleGateProps {
  allowedRoles: UserRole[]
  children: ReactNode
  fallback?: ReactNode
}

const RoleGate: React.FC<RoleGateProps> = ({ allowedRoles, children, fallback = null }) => {
  const { user } = useAuth()

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

export default RoleGate
