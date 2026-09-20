import { cn } from '@/utils/cn'

const tones = {
  green: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  neutral: 'bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-neutral-400',
}

function StatCard({ icon: Icon, label, value, badge, tone = 'neutral' }) {
  const badgeText = typeof badge === 'string' ? badge : badge?.text
  const badgeTone = typeof badge === 'string' ? tone : (badge?.tone || tone)

  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-edge transition-colors duration-300 dark:bg-[#1c1c28] dark:ring-neutral-800">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-leaf/15 text-forest dark:bg-leaf/10 dark:text-leaf">
        <Icon size={22} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-gray-400 dark:text-neutral-500">{label}</p>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-2xl font-bold text-ink dark:text-neutral-50">{value}</p>
          {badgeText && <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', tones[badgeTone])}>{badgeText}</span>}
        </div>
      </div>
    </div>
  )
}

export default StatCard
