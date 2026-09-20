import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hook/UseAuth'
import { hasRole } from '@/utils/Roles'
import Spinner from '@/components/ui/Spinner'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, checking, user } = useAuth()
  const location = useLocation()

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" color="gray" />
      </div>
    )
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
