function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function AccountTabs({ tabs, active, onChange }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-sm dark:border-neutral-800 dark:bg-[#16271F]" data-aos="fade-up">
      <div className="flex min-w-max gap-1.5">
        {tabs.map((tab) => {
          const isActive = tab.key === active
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={cn(
                'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-forest text-white dark:bg-leaf dark:text-forest'
                  : 'text-neutral-600 hover:bg-mist hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-neutral-100',
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default AccountTabs