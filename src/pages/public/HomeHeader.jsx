import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hook/UseAuth'
import { hasRole, ROLES } from '@/utils/Roles'
import ThemeToggle from '@/components/ui/ThemeToggle'
import ProfileAvatar from '@/components/ui/ProfileAvatar'
import CustomerRequestModal from '@/components/request/CustomerRequestModal'

const NAV_LINKS = [
  { label: 'Frames', href: '/products' },
  { label: 'Sunglasses', href: '/products' },
  { label: 'Eye Exams', href: '#craft' },
  { label: 'About', href: '/about' },
]

export default function HomeHeader() {
  const [open, setOpen] = useState(false)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isAdmin = hasRole(user, ROLES.ADMIN)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleDashboard = () => {
    navigate('/dashboard')
  }

  const handleRequestClick = () => {
    if (!token) {
      navigate('/login', { state: { from: location } })
    } else {
      setIsRequestModalOpen(true)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-[#faf7f2]/90 backdrop-blur transition-colors duration-300 dark:border-neutral-800 dark:bg-[#111118]/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <a href="/" className="flex items-baseline gap-1 font-sans font-semibold text-xl tracking-tight text-neutral-900 dark:text-neutral-50">
          Optic <span className="italic">Shop</span>
        </a>

        <nav className="hidden items-center gap-7 text-sm text-neutral-600 dark:text-neutral-400 lg:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="transition-colors hover:text-neutral-900 dark:hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {isAdmin && (
            <button
              type="button"
              onClick={handleDashboard}
              className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-900 dark:border-neutral-600 dark:text-neutral-200 dark:hover:border-neutral-100"
            >
              Dashboard
            </button>
          )}
          <button
            type="button"
            onClick={handleRequestClick}
            className="rounded-full bg-[#8fa88f] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#6f8a6f]"
          >
            Request
          </button>
          {token ? (
            <>
              <ProfileAvatar user={user} />
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="M16 17l5-5-5-5" />
                  <path d="M21 12H9" />
                </svg>
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-900 dark:border-neutral-600 dark:text-neutral-200 dark:hover:border-neutral-100"
            >
              Sign In
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg p-2 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/10 lg:hidden"
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-neutral-200 bg-[#faf7f2] px-4 py-3 dark:border-neutral-800 dark:bg-[#111118] lg:hidden">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="border-b border-neutral-100 py-3 text-sm text-neutral-700 dark:border-neutral-800 dark:text-neutral-400">
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 py-4">
            <button
              type="button"
              onClick={() => { handleRequestClick(); setOpen(false) }}
              className="w-full rounded-full bg-[#8fa88f] py-2.5 text-center text-sm font-semibold text-white"
            >
              Request
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={() => { handleDashboard(); setOpen(false) }}
                className="w-full rounded-full border border-neutral-300 py-2.5 text-center text-sm text-neutral-800 dark:border-neutral-700 dark:text-neutral-300"
              >
                Dashboard
              </button>
            )}
            {token ? (
              <>
                <div className="flex justify-center">
                  <ProfileAvatar user={user} onClick={() => setOpen(false)} />
                </div>
                <button
                  type="button"
                  onClick={() => { handleLogout(); setOpen(false) }}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <path d="M16 17l5-5-5-5" />
                    <path d="M21 12H9" />
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="w-full rounded-full border border-neutral-300 py-2.5 text-center text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-neutral-600 dark:text-neutral-200 dark:hover:border-neutral-100 dark:hover:bg-neutral-100 dark:hover:text-neutral-900">
                Sign In
              </Link>
            )}
          </div>
        </nav>
      )}

      <CustomerRequestModal open={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} />
    </header>
  )
}
