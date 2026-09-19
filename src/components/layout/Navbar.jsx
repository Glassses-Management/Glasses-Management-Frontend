import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, LayoutDashboard, LogOut, Menu, Moon, Search, ShieldCheck, ShoppingCart, Sun, User, X } from 'lucide-react'
import { useTheme } from '@/hook/UseTheme'
import { useAuth } from '@/hook/UseAuth'
import { useCart } from '@/hook/UseCart'
import { getInitials } from '@/utils/avatar'
import { ROLES } from '@/utils/Roles'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Explore', href: '/explore' },
  { label: 'Product', href: '/products' },
  { label: 'Contact', href: '/contact' },
  { label: 'About', href: '/about' },
]

// Round icon button base: no border, subtle gray hover, focus ring for keyboard users.
const roundBtn =
  'inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 transition-colors duration-200 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white'

// ONE base class for every pill button (works for both <button> and <Link>/<a>):
// fixed 36px height, inline-flex locks the text to the vertical center, and a
// shared corner radius so Request / Sign In / Dashboard all match.
const pillBase =
  'inline-flex h-9 items-center justify-center rounded-xl text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2'

// Outlined pill used for Sign In / Dashboard / mobile links.
const outline =
  `${pillBase} border border-neutral-300 px-5 font-medium text-neutral-700 hover:border-forest hover:text-forest dark:border-neutral-600 dark:text-neutral-200 dark:hover:border-leaf dark:hover:text-leaf`

// Solid green pill for the primary Request action.
const solid =
  `${pillBase} bg-forest px-6 font-semibold text-white shadow-sm shadow-forest/20 hover:bg-forest-deep hover:shadow-md`

// Dropdown menu rows (account card) — softer taller rows with icon spacing.
const menuItem =
  'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors'

// Round theme toggle (Sun/Moon) via the app's ThemeProvider.
function ThemeButton() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      className={roundBtn}
    >
      {isDark ? <Sun size={18} strokeWidth={1.75} /> : <Moon size={18} strokeWidth={1.75} />}
    </button>
  )
}

// Round cart button with a dark-green count badge (thin white ring) in the corner.
function CartIcon({ count }) {
  return (
    <Link
      to="/cart"
      aria-label={`Shopping cart, ${count} item${count === 1 ? '' : 's'}`}
      className={roundBtn}
    >
      <ShoppingCart size={18} strokeWidth={1.75} />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-forest px-1 text-[11px] font-bold text-white ring-2 ring-white dark:ring-[#0E1A15]">
          {count}
        </span>
      )}
    </Link>
  )
}

// Optional props override the app's Context values, so this works both as a
// drop-in <Navbar /> and as a controlled component.
// isLoggedIn, currentPath, onLogout, userInitials, cartCount (existing)
// isAdmin, userImage, userName, onSearch (new — fall back to Auth context).
export default function Navbar({ isLoggedIn, currentPath, onLogout, userInitials, cartCount, isAdmin, userImage, userName, onSearch }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  const { user, logout } = useAuth()
  const { count } = useCart()

  const authed = isLoggedIn ?? !!user
  const path = currentPath ?? location.pathname
  const total = cartCount ?? count
  const initials = userInitials ?? getInitials(user?.name || '')
  // Roles come back from the API in many shapes (plain string, {name}, {role},
  // {authority}, or arrays), so normalise before comparing.
  const rawRoles = user?.role
    ? typeof user.role === 'string'
      ? [user.role]
      : user.role?.name || user.role?.role || user.role?.authority
        ? [user.role?.name || user.role?.role || user.role?.authority]
        : []
    : Array.isArray(user?.roles)
      ? user.roles.map((r) => r?.name || r?.role || String(r))
      : Array.isArray(user?.authorities)
        ? user.authorities.map((a) => a?.authority || a?.role || String(a))
        : []
  const admin = isAdmin ?? (authed && rawRoles.some((r) => String(r).toUpperCase().replace(/^ROLE_/, '') === ROLES.ADMIN))
  const name = userName ?? user?.name
  const avatarImage = userImage

  const closeAccount = () => setAccountOpen(false)

  // Close the account dropdown on outside click or Escape.
  useEffect(() => {
    if (!accountOpen) return undefined
    const onMouseDown = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) closeAccount()
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeAccount()
    }
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [accountOpen])

  const handleLogout = () => {
    closeAccount()
    setMenuOpen(false)
    if (onLogout) onLogout()
    else {
      logout()
      navigate('/')
    }
  }

  const handleSearch = () => {
    if (onSearch) onSearch()
    else navigate('/products')
  }

  // Home matches only the exact path; other links match any sub-route beneath them.
  const isActive = (href) => (href === '/' ? path === '/' : path.startsWith(href))

  const linkClass = (href) =>
    `relative rounded-full py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 ${
      isActive(href)
        ? 'text-forest after:absolute after:inset-x-0 after:bottom-1.5 after:h-0.5 after:rounded-full after:bg-forest after:content-[\'\'] dark:text-leaf dark:after:bg-leaf'
        : 'text-neutral-600 hover:text-forest dark:text-neutral-300 dark:hover:text-leaf'
    }`

  // Logged out: send them to login with the bounce-back path. Logged in: straight to the request flow.
  const handleRequest = () => {
    setMenuOpen(false)
    if (!authed) navigate('/login', { state: { from: path } })
    else navigate('/request')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur-md transition-colors duration-300 dark:border-neutral-800 dark:bg-[#0E1A15]/90">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4 md:px-6">
        {/* Column 1 — logo (left). "Shop" stays italic for the brand. */}
        <Link to="/" onClick={() => setMenuOpen(false)} className="justify-self-start text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Optic <span className="italic">Shop</span>
        </Link>

        {/* Column 2 — centered links, same position in both auth states. */}
        <nav className="hidden justify-self-center items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={linkClass(link.href)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Column 3 — right-side actions (all 36px tall). */}
        <div className="ml-4 flex items-center justify-self-end gap-1.5">
          {/* Admin badge — admin only, shows from 1280px up (xl). */}
          {authed && admin && (
            <span className="mr-2 hidden h-9 items-center gap-1.5 whitespace-nowrap rounded-full bg-emerald-50 px-3 text-xs font-semibold text-forest xl:inline-flex dark:bg-leaf/15 dark:text-leaf">
              <ShieldCheck size={14} strokeWidth={1.75} /> Admin Mode
            </span>
          )}

          <button type="button" onClick={handleSearch} aria-label="Search products" className={roundBtn}>
            <Search size={18} strokeWidth={1.75} />
          </button>

          <ThemeButton />
          <CartIcon count={total} />

          {/* Desktop text actions (collapse into the hamburger below lg). */}
          <div className="ml-2 hidden items-center gap-2 lg:flex">
            {/* Thin divider separating the icon group from the action group. */}
            <span aria-hidden="true" className="mx-2 hidden h-5 w-px bg-neutral-200 md:block dark:bg-white/10" />
            {authed ? (
              <>
                <button type="button" onClick={handleRequest} className={solid}>Request</button>

                {/* Avatar + chevron open the account dropdown. */}
                <div className="relative" ref={accountRef}>
                  <button
                    type="button"
                    onClick={() => setAccountOpen((o) => !o)}
                    aria-label="Account menu"
                    aria-haspopup="menu"
                    aria-expanded={accountOpen}
                    className="flex h-9 items-center gap-0.5 rounded-full pl-1 pr-1.5 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 dark:hover:bg-white/10"
                  >
                    {avatarImage ? (
                      <img src={avatarImage} alt={name || 'Account'} className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-forest ring-1 ring-emerald-200/70 dark:bg-leaf/15 dark:text-leaf dark:ring-white/10">
                        {initials || '?'}
                      </span>
                    )}
                    <ChevronDown
                      size={16}
                      strokeWidth={1.75}
                      className={`shrink-0 text-neutral-500 transition-transform duration-200 dark:text-neutral-400 ${accountOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Dropdown card, right-aligned under the avatar. */}
                  {accountOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg dark:border-neutral-700 dark:bg-[#16271F]">
                      {name && (
                        <p className="truncate px-3 py-2 text-xs text-neutral-400 dark:text-neutral-500">{name}</p>
                      )}
                      <Link to="/dashboard" onClick={closeAccount} className={`${menuItem} text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-white/10`}>
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      <Link to="/account" onClick={closeAccount} className={`${menuItem} text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-white/10`}>
                        <User size={16} /> My Account
                      </Link>
                      <div className="my-1 h-px bg-neutral-100 dark:bg-neutral-700" />
                      <button
                        type="button"
                        onClick={handleLogout}
                        className={`${menuItem} text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10`}
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button type="button" onClick={handleRequest} className={solid}>Request</button>
                <Link to="/login" className={outline}>Sign In</Link>
              </>
            )}
          </div>

          {/* Hamburger opens the mobile menu below lg. */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 dark:text-neutral-300 dark:hover:bg-white/10 lg:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown: links + the same action buttons, stacked. */}
      {menuOpen && (
        <nav className="border-t border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-[#0E1A15] lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block rounded-full px-3 py-2.5 text-sm font-medium ${
                isActive(link.href)
                  ? 'bg-forest/10 text-forest dark:bg-leaf/10 dark:text-leaf'
                  : 'text-neutral-700 dark:text-neutral-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-1.5 border-t border-neutral-100 pt-3 dark:border-neutral-800">
            <button type="button" onClick={handleRequest} className={`${solid} w-full`}>Request</button>
            {authed ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className={`${outline} w-full`}>Dashboard</Link>
                <Link to="/account" onClick={() => setMenuOpen(false)} className={`${outline} w-full`}>My Account</Link>
                <button type="button" onClick={handleLogout} className={`${menuItem} justify-center text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10`}>
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className={`${outline} w-full`}>Sign In</Link>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}