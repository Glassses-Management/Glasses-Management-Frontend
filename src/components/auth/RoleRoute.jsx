import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hook/UseAuth'
import { hasRole } from '@/utils/Roles'
import Spinner from '@/components/ui/Spinner'

// Role gate for a subset of routes. Deliberately mirrors ProtectedRoute, with
// two differences: a signed-in user who lacks the role is sent to /dashboard
// instead of /, and the prop is also called `allowedRoles` so the two guards
// are interchangeable at the call site.
export default function RoleRoute({ allowedRoles, children }) {
  const { token, checking, user } = useAuth()
  const location = useLocation()

  // Without this, a hard refresh on a guarded URL reads `user` as null while
  // AuthContext is still revalidating the stored JWT, and a perfectly valid
  // session gets thrown to /login.
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

  if (!user || !allowedRoles?.some((role) => hasRole(user, role))) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
