import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default function DashboardLayout({ activeRoute, onNavigate, user, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleNavigate = (key) => {
    onNavigate?.(key)
    setSidebarOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-[#f5f6fb]">
      <Sidebar
        activeRoute={activeRoute}
        onNavigate={handleNavigate}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          user={user}
          onLogout={onLogout}
          onToggleSidebar={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
