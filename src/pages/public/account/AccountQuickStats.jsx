import { QUICK_STATS } from '@/pages/public/account/AccountData'

function AccountQuickStats() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {QUICK_STATS.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#16271F]"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            {stat.label}
          </p>
          <p className="mt-2 text-xl font-semibold text-neutral-900 dark:text-neutral-50">{stat.value}</p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{stat.sub}</p>
        </div>
      ))}
    </div>
  )
}

export default AccountQuickStats