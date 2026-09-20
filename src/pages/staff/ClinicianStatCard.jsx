const deltaTones = {
  good: 'text-green-600 dark:text-green-400',
  warn: 'text-amber-600 dark:text-amber-400',
  bad: 'text-red-600 dark:text-red-400',
  muted: 'text-gray-500 dark:text-neutral-400',
}

function ClinicianStatCard({ label, value, delta, deltaTone = 'good', children, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-edge bg-white p-4 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#16271F] ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-ink dark:text-neutral-50">{value}</p>
      <p className={`mt-1 text-xs font-medium ${deltaTones[deltaTone]}`}>{delta}</p>
      {children && <div className="mt-3">{children}</div>}
    </div>
  )
}

export default ClinicianStatCard