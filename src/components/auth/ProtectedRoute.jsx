import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hook/UseAuth'
import { hasRole } from '@/utils/Roles'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, checking, user } = useAuth()
  const location = useLocation()

  if (checking) {
    return null
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && allowedRoles.length > 0 && user) {
    const allowed = allowedRoles.some((role) => hasRole(user, role))
    if (!allowed) {
      return <Navigate to="/" replace />
    }
  }

  return children
}
