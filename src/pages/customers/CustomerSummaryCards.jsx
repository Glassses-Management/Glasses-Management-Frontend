import { CalendarCheck, ClipboardList, Receipt, Wallet } from 'lucide-react'

import { card, cardBody } from '@/pages/customers/customerDetailStyles'

// The four numbers a staff member checks before deciding what to do next for
// this customer: how much they buy, when they are due back, and how much they
// have spent. `stats` comes from summaryStats() so the cards always agree with
// the tables below them.

const ICONS = {
  orders: Receipt,
  appointments: CalendarCheck,
  requests: ClipboardList,
  spent: Wallet,
}

const TONES = {
  orders: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300',
  appointments: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300',
  requests: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300',
  spent: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-300',
}

function SummaryCard({ stat }) {
  const Icon = ICONS[stat.key] || Receipt

  return (
    <div className={`${card} ${cardBody} flex items-start gap-3`}>
      <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${TONES[stat.key] || TONES.orders}`} aria-hidden="true">
        <Icon size={16} />
      </span>

      <div className="min-w-0">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-400">
          {stat.label}
        </p>
        <p className="mt-0.5 text-2xl font-semibold leading-tight text-gray-900 dark:text-neutral-50">{stat.value}</p>
        <p className="mt-1 truncate text-xs text-gray-500 dark:text-neutral-400" title={stat.hint}>
          {stat.hint}
        </p>
      </div>
    </div>
  )
}

function SummarySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className={`${card} ${cardBody} flex items-start gap-3`}>
          <span className="size-9 shrink-0 animate-pulse rounded-xl bg-gray-100 dark:bg-white/5" />
          <div className="flex-1 space-y-2">
            <div className="h-2.5 w-20 animate-pulse rounded bg-gray-100 dark:bg-white/5" />
            <div className="h-6 w-12 animate-pulse rounded bg-gray-100 dark:bg-white/5" />
            <div className="h-2.5 w-24 animate-pulse rounded bg-gray-100 dark:bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function CustomerSummaryCards({ stats, loading }) {
  if (loading) return <SummarySkeleton />

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <SummaryCard key={stat.key} stat={stat} />
      ))}
    </div>
  )
}
