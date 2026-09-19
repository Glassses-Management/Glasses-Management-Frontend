import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hook/UseAuth'
import { useCart } from '@/hook/UseCart'
import { hasRole, ROLES } from '@/utils/Roles'
import ThemeToggle from '@/components/ui/ThemeToggle'
import ProfileAvatar from '@/components/ui/ProfileAvatar'
import CartButton from '@/components/ui/CartButton'

const NAV_LINKS = [
  { label: 'Explore', href: '/products' },
  { label: 'Product', href: '/products' },
  { label: 'Contact', href: '/contact' },
  { label: 'About', href: '/about' },
]

export default function HomeHeader() {
  const [open, setOpen] = useState(false)
  const { token, user, logout } = useAuth()
  const { count } = useCart()
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
      navigate('/request')
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur transition-colors duration-300 dark:border-neutral-800 dark:bg-[#0E1A15]/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <a href="/" className="flex items-baseline gap-1 font-sans font-semibold text-xl tracking-tight text-neutral-900 dark:text-neutral-50">
          Optic <span className="italic">Shop</span>
        </a>

        <nav className="hidden items-center gap-8 text-sm lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group relative font-sans font-medium tracking-wide text-neutral-700 transition-colors duration-200 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
            >
              {link.label}
              <span className="absolute -bottom-1.5 left-0 h-[2px] w-full origin-left scale-x-0 rounded-full bg-forest transition-transform duration-300 group-hover:scale-x-100 dark:bg-leaf" />
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <CartButton />
          {isAdmin && (
            <button
              type="button"
              onClick={handleDashboard}
              className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:border-forest hover:text-forest dark:border-neutral-600 dark:text-neutral-200 dark:hover:border-leaf dark:hover:text-leaf"
            >
              Dashboard
            </button>
          )}
          <button
            type="button"
            onClick={handleRequestClick}
            className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-deep"
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
              className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:border-forest hover:text-forest dark:border-neutral-600 dark:text-neutral-200 dark:hover:border-leaf dark:hover:text-leaf"
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
        <nav className="flex flex-col border-t border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-[#0E1A15] lg:hidden">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="border-b border-neutral-100 py-3 text-sm text-neutral-700 dark:border-neutral-800 dark:text-neutral-400">
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 py-4">
            <Link to="/cart" onClick={() => setOpen(false)} className="w-full rounded-full border border-neutral-300 py-2.5 text-center text-sm font-medium text-neutral-800 transition-colors hover:border-forest hover:bg-forest hover:text-white dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-100 dark:hover:text-neutral-900">
              View Cart ({count})
            </Link>
            <button
              type="button"
              onClick={() => { handleRequestClick(); setOpen(false) }}
              className="w-full rounded-full bg-forest py-2.5 text-center text-sm font-semibold text-white"
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
              <Link to="/login" onClick={() => setOpen(false)} className="w-full rounded-full border border-neutral-300 py-2.5 text-center text-sm font-medium text-neutral-800 transition-colors hover:border-forest hover:bg-forest hover:text-white dark:border-neutral-600 dark:text-neutral-200 dark:hover:border-leaf dark:hover:bg-leaf dark:hover:text-forest">
                Sign In
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
