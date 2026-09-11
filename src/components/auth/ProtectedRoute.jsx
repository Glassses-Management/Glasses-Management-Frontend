import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hook/UseAuth'

export default function ProtectedRoute({ children }) {
  const { token, checking } = useAuth()

  // Wait for the stored token to be validated against /auth/me on first load,
  // so an expired session is redirected to /login instead of briefly flashing.
  if (checking) {
    return null
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}