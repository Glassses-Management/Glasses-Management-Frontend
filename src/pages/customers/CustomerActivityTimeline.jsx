import { Link } from 'react-router-dom'

import { relativeDay } from '@/pages/customers/customerDetailData'
import { card, cardBody, cardTitle, cardSubtitle } from '@/pages/customers/customerDetailStyles'

// Reverse-chronological feed of everything that happened to this customer:
// registration, orders, exams, prescriptions and clinical requests merged into
// one list. This is the card that makes the "one customer, many records"
// relationship obvious at a glance.
//
// The dot colour is the only status signal - green for something finished, blue
// for something in flight, red for something rejected. No badges here, so the
// timeline stays quiet next to the tables.

const DOT_TONES = {
  success: 'bg-green-500',
  info: 'bg-blue-500',
  neutral: 'bg-gray-300 dark:bg-neutral-600',
  danger: 'bg-red-500',
}

const RING_TONES = {
  success: 'ring-green-100 dark:ring-green-500/20',
  info: 'ring-blue-100 dark:ring-blue-500/20',
  neutral: 'ring-gray-100 dark:ring-white/10',
  danger: 'ring-red-100 dark:ring-red-500/20',
}

function ActivityRow({ item, isLast }) {
  const content = (
    <>
      <span className="relative flex flex-col items-center">
        <span className={`mt-1.5 size-2 shrink-0 rounded-full ${DOT_TONES[item.tone] || DOT_TONES.neutral} ring-4 ${RING_TONES[item.tone] || RING_TONES.neutral}`} aria-hidden="true" />
        {!isLast && <span className="mt-1 w-px flex-1 bg-gray-200 dark:bg-neutral-800" aria-hidden="true" />}
      </span>

      <div className="min-w-0 flex-1 pb-4">
        <p className="text-sm font-medium text-gray-900 dark:text-neutral-50">{item.title}</p>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">{item.detail}</p>
        <p className="mt-0.5 text-[11px] text-gray-400 dark:text-neutral-500">{relativeDay(item.at)}</p>
      </div>
    </>
  )

  return (
    <li className="flex gap-3">
      {item.to ? (
        <Link to={item.to} className="flex flex-1 gap-3 rounded-lg transition-opacity duration-300 hover:opacity-80">
          {content}
        </Link>
      ) : (
        content
      )}
    </li>
  )
}

export default function CustomerActivityTimeline({ items, onViewAll }) {
  return (
    <section className={card}>
      <div className={`${cardBody} flex items-start justify-between gap-3 pb-1`}>
        <div>
          <h2 className={cardTitle}>Recent Activity</h2>
          <p className={cardSubtitle}>Newest first</p>
        </div>
      </div>

      <div className={`${cardBody} pt-2`}>
        {items.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500 dark:text-neutral-400">No activity recorded yet.</p>
        ) : (
          <ul>
            {items.map((item, index) => (
              <ActivityRow key={`${item.title}-${item.at}`} item={item} isLast={index === items.length - 1} />
            ))}
          </ul>
        )}

        {onViewAll && items.length > 0 && (
          <button
            type="button"
            onClick={onViewAll}
            className="mt-1 w-full rounded-lg border border-gray-200 py-2 text-xs font-medium text-gray-600 transition-colors duration-300 hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-white/5"
          >
            View all activity
          </button>
        )}
      </div>
    </section>
  )
}
