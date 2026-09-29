import { Link } from 'react-router-dom'
import { CalendarCheck, ChevronRight, ClipboardList, FileText } from 'lucide-react'

import Badge from '@/components/ui/Badge'
import { formatDate, formatDateTime } from '@/utils/format'
import { REQUEST_TYPE_LABEL } from '@/utils/RequestOrder'
import { isRxExpired } from '@/pages/customers/customerDetailData'
import { card, cardHead, cardTitle } from '@/pages/customers/customerDetailStyles'

// One list component for the three record tabs that are not the orders table:
// prescriptions, appointments and clinical requests. They share a shape (a
// title, a date, a status, one line of detail) so they share a component instead
// of three near-identical files.
//
// Mobile-first: each row is already a two-line block, so there is no separate
// card layout to maintain here.

const EYE_SUMMARY = (rx) => `OD ${rx.od_sphere ?? '—'} / OS ${rx.os_sphere ?? '—'} · PD ${rx.pupillary_distance ?? '—'} mm`

const KINDS = {
  prescription: {
    icon: FileText,
    empty: 'No prescriptions recorded. Book an eye exam to start a clinical record.',
    render: (rx) => ({
      id: rx.id,
      title: `Prescription #${rx.id}`,
      when: formatDate(rx.prescription_date || rx.created_at),
      detail: rx.notes || EYE_SUMMARY(rx),
      badge: <Badge text={isRxExpired(rx) ? 'EXPIRED' : 'CURRENT'} variant={isRxExpired(rx) ? 'danger' : 'success'} />,
      to: `/dashboard/prescriptions/${rx.id}`,
    }),
  },
  appointment: {
    icon: CalendarCheck,
    empty: 'No appointments booked for this customer.',
    render: (appointment) => ({
      id: appointment.id,
      title: `${formatDate(appointment.scheduled_at, { weekday: 'short' })} · ${formatDateTime(appointment.scheduled_at)}`,
      when: formatDate(appointment.scheduled_at),
      detail: appointment.notes || 'Consultation',
      badge: <Badge text={appointment.status} />,
      to: `/dashboard/appointments/${appointment.id}`,
    }),
  },
  request: {
    icon: ClipboardList,
    empty: 'No clinical requests submitted by this customer.',
    render: (request) => ({
      id: request.id,
      title: `${REQUEST_TYPE_LABEL[request.type] || request.type || 'Clinical'} request`,
      // Request.createdAt is camelCase, unlike every other entity here.
      when: formatDate(request.createdAt ?? request.created_at),
      detail: request.notes || `Request #${request.id}`,
      badge: <Badge text={request.status} />,
      to: '/dashboard/requests',
    }),
  },
}

function RecordRow({ row }) {
  return (
    <li className="border-t border-gray-100 dark:border-neutral-800">
      <Link to={row.to} className="flex items-start gap-3 px-5 py-3.5 transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-white/5">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-gray-900 dark:text-neutral-50">{row.title}</p>
            {row.badge}
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">{row.when}</p>
          <p className="mt-0.5 truncate text-sm text-gray-600 dark:text-neutral-300" title={row.detail}>
            {row.detail}
          </p>
        </div>
        <ChevronRight size={16} className="mt-1 shrink-0 text-gray-300 dark:text-neutral-600" aria-hidden="true" />
      </Link>
    </li>
  )
}

export default function CustomerRecordList({ kind, items }) {
  const config = KINDS[kind]
  const Icon = config.icon
  const rows = items.map(config.render)

  return (
    <section className={card}>
      <div className={cardHead}>
        <div>
          <h2 className={cardTitle}>
            {kind === 'prescription' ? 'Prescription History' : kind === 'appointment' ? 'Appointments' : 'Clinical Requests'}
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
            {items.length} record{items.length === 1 ? '' : 's'}
          </p>
        </div>
        <span className="flex size-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-neutral-400">
          <Icon size={15} />
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-gray-500 dark:text-neutral-400">{config.empty}</p>
      ) : (
        <ul>
          {rows.map((row) => (
            <RecordRow key={`${kind}-${row.id}`} row={row} />
          ))}
        </ul>
      )}
    </section>
  )
}
