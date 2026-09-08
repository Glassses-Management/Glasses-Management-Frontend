import { Bell, LogOut, Menu } from 'lucide-react'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function Header({ user, onToggleSidebar, onLogout }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#1c1c28] md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-[#1a1a2e] transition-colors duration-300 hover:bg-gray-100 dark:text-neutral-100 dark:hover:bg-white/10 md:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-[#1a1a2e] dark:text-neutral-50">Optical Shop</h1>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <button
          type="button"
          className="relative rounded-lg p-2 text-gray-400 transition-colors duration-300 hover:bg-gray-100 hover:text-[#1a1a2e] dark:text-neutral-500 dark:hover:bg-white/10 dark:hover:text-neutral-100"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#8fa88f]" />
        </button>

        <div className="flex items-center gap-3 border-l border-gray-200 pl-3 dark:border-neutral-700">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8fa88f]/20 font-semibold text-[#1a1a2e] dark:text-neutral-900">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium leading-tight text-[#1a1a2e] dark:text-neutral-50">
              {user?.name || 'Admin'}
            </p>
            <p className="text-xs text-gray-400 dark:text-neutral-500">{user?.role || 'Administrator'}</p>
          </div>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
            >
              <LogOut size={15} />
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
