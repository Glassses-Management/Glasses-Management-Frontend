import { Outlet } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function DashboardShell({ onNavigate }) {
  return (
    <ProtectedRoute>
      <DashboardLayout onNavigate={onNavigate}>
        <Outlet />
      </DashboardLayout>
    </ProtectedRoute>
  )
}