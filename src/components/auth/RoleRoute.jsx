import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hook/UseAuth'
import { hasRole } from '@/utils/Roles'

export default function RoleRoute({ roles, children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const allowed = roles.some((role) => hasRole(user, role))

  if (!allowed) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}