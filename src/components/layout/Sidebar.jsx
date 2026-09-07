import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Glasses,
  Package,
  ClipboardList,
  CalendarClock,
  FileText,
  Send,
  ChevronLeft,
} from 'lucide-react'

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [{ key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Management',
    items: [
      { key: 'customers', label: 'Customers', icon: Users },
      { key: 'products', label: 'Products', icon: Glasses },
      { key: 'inventory', label: 'Inventory', icon: Package },
      { key: 'orders', label: 'Orders', icon: ClipboardList },
    ],
  },
  {
    label: 'Care',
    items: [
      { key: 'appointments', label: 'Appointments', icon: CalendarClock },
      { key: 'prescriptions', label: 'Prescriptions', icon: FileText },
    ],
  },
  {
    label: 'Service',
    items: [{ key: 'requests', label: 'Requests', icon: Send }],
  },
  {
    label: 'Access',
    items: [{ key: 'users', label: 'Users', icon: Users }],
  },
]

function SidebarItem({ item, active, collapsed, onNavigate }) {
  const Icon = item.icon
  return (
    <button
      type="button"
      onClick={() => onNavigate(item.key)}
      title={collapsed ? item.label : undefined}
      className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
        collapsed ? 'justify-center' : ''
      } ${
        active
          ? 'bg-[#8fa88f]/10 text-[#1a1a2e] dark:bg-[#8fa88f]/15 dark:text-white'
          : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:text-neutral-500 dark:hover:bg-white/5 dark:hover:text-neutral-200'
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-[#8fa88f]" />
      )}
      <Icon
        size={20}
        className={active ? 'text-[#8fa88f]' : 'text-gray-400 group-hover:text-[#8fa88f] dark:text-neutral-500'}
      />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </button>
  )
}

export default function Sidebar({ activeRoute, onNavigate, mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpenStateInternal, setMobileOpenStateInternal] = useState(false)
  const isMobileOpen = mobileOpen !== undefined ? mobileOpen : mobileOpenStateInternal

  const setMobile = (next) => {
    if (mobileOpen !== undefined) {
      onMobileClose?.(next)
    } else {
      setMobileOpenStateInternal(next)
    }
  }

  const goTo = (key) => {
    onNavigate?.(key)
    setMobile(false)
  }

  const openMobile = () => setMobile(true)

  const handleCollapseToggle = () => {
    if (collapsed) {
      setCollapsed(false)
    } else {
      setCollapsed(true)
    }
  }

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white transition-colors duration-300 dark:bg-[#1c1c28]">
      <div
        className={`flex items-center gap-3 border-b border-gray-100 px-4 py-4 transition-all duration-200 dark:border-neutral-800 ${
          collapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1a1a2e]">
              <Glasses size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-[#1a1a2e] dark:text-neutral-50">glasses-web</span>
          </div>
        )}
        <button
          type="button"
          onClick={handleCollapseToggle}
          className="hidden rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#1a1a2e] dark:text-neutral-500 dark:hover:bg-white/10 dark:hover:text-neutral-100 md:block"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            size={18}
            className={`transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {NAV_SECTIONS.map((section, index) => (
          <div key={section.label} className={index > 0 ? 'mt-2 border-t border-gray-100 pt-2 dark:border-neutral-800' : ''}>
            {!collapsed && (
              <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-600">
                {section.label}
              </p>
            )}
            <div className="flex flex-col gap-1">
              {section.items.map((item) => (
                <SidebarItem
                  key={item.key}
                  item={item}
                  active={activeRoute === item.key}
                  collapsed={collapsed}
                  onNavigate={goTo}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className={`border-t border-gray-100 p-3 dark:border-neutral-800 ${collapsed ? 'text-center' : ''}`}>
        <div className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-gray-50 dark:hover:bg-white/5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#8fa88f]/20 font-semibold text-[#1a1a2e] dark:text-neutral-900">
            A
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#1a1a2e] dark:text-neutral-50">Admin</p>
              <p className="truncate text-xs text-gray-400 dark:text-neutral-500">Administrator</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-gray-200 shadow-sm transition-all duration-200 dark:border-neutral-800 md:flex ${
          collapsed ? 'w-[76px]' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobile(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform shadow-sm transition-transform duration-200 md:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      <button
        type="button"
        onClick={openMobile}
        className={`fixed left-3 top-3 z-50 rounded-lg bg-white p-2 text-[#1a1a2e] shadow-sm transition-colors duration-300 dark:bg-[#1c1c28] dark:text-neutral-100 dark:ring-1 dark:ring-neutral-700 md:hidden ${
          mobileOpen !== undefined ? 'hidden' : ''
        }`}
        aria-label="Open sidebar"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </svg>
      </button>
    </>
  )
}
