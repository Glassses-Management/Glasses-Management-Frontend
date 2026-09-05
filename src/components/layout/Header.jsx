import { Bell, Menu } from 'lucide-react'

export default function Header({ user, onToggleSidebar, onLogout }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-[#1a1a2e] transition-colors hover:bg-gray-100 md:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-[#1a1a2e]">Optical Shop</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#1a1a2e]"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#8fa88f]" />
        </button>

        <div className="flex items-center gap-3 border-l border-gray-200 pl-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8fa88f]/20 font-semibold text-[#1a1a2e]">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium leading-tight text-[#1a1a2e]">
              {user?.name || 'Admin'}
            </p>
            <p className="text-xs text-gray-400">{user?.role || 'Administrator'}</p>
          </div>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
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
