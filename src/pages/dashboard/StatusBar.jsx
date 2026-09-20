import { Circle } from 'lucide-react'
import { cn } from '@/utils/cn'

function StatusBar({ user }) {
  const name = user?.name || user?.first_name || 'Admin'
  const role = user?.role?.name || user?.role || 'ADMIN'
  const online = user?.active === true

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-edge pt-4 pb-6 text-xs text-gray-400 transition-colors duration-300 dark:border-neutral-800 dark:text-neutral-500">
      <p className="inline-flex items-center gap-1.5">
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-neutral-600" />
        © {new Date().getFullYear()} OptiVue Optical · All rights reserved
      </p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className="inline-flex items-center gap-1.5">
          <Circle size={10} className={cn('fill-current', online ? 'text-green-500' : 'text-gray-400 dark:text-neutral-500')} />
          Logged in as <span className="font-medium text-gray-500 dark:text-neutral-300">{name}</span>
          <span className="font-semibold text-forest dark:text-leaf">({role})</span>
        </span>
        <a href="#" className="hover:text-gray-500 dark:hover:text-neutral-300">Support</a>
        <span className="text-gray-300 dark:text-neutral-700">·</span>
        <a href="#" className="hover:text-gray-500 dark:hover:text-neutral-300">Privacy Policy</a>
      </div>
    </div>
  )
}

export default StatusBar