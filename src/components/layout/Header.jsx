import { Bell, Menu } from 'lucide-react'
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
              className="rounded-lg p-2 text-gray-400 transition-colors duration-300 hover:bg-red-50 hover:text-red-500 dark:text-neutral-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
              aria-label="Logout"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
