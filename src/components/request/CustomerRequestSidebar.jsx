import { useEffect, useState } from 'react'
import { ArrowRight, Clock, FileText, Mail, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '@/components/ui/Badge'
import { getMyRequests } from '@/api/requestApi'
import { formatDate } from '@/utils/FormatDate'

const STEPS = [
  { title: 'Submit your request', text: 'Tell us what you need in the form.' },
  { title: 'Our optical staff reviews it', text: 'We check details and availability.' },
  { title: 'We contact you', text: 'We update your request status and reach out.' },
  { title: 'Complete your visit', text: 'Book the exam or confirm your product.' },
]

const HELP = [
  { icon: Phone, label: 'Phone', value: '+855 XX XXX XXX', href: 'tel:+855000000000' },
  { icon: Mail, label: 'Email', value: 'support@opticshop.com', href: 'mailto:support@opticshop.com' },
  { icon: Clock, label: 'Opening hours', value: 'Mon – Sat · 8:00 AM – 6:00 PM' },
]

const STATUS_VARIANT = {
  PENDING: 'warning',
  PENDING_REVIEW: 'warning',
  APPROVED: 'success',
  CONFIRMED: 'info',
  IN_PROGRESS: 'info',
  READY_FOR_PICKUP: 'success',
  COMPLETED: 'neutral',
  REJECTED: 'danger',
  CANCELLED: 'neutral',
}

const TYPE_LABEL = {
  exam: 'Eye Exam Request',
  product: 'Product Request',
}

function SideCard({ title, children, icon: Icon }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200/70 dark:bg-neutral-800/60 dark:ring-neutral-700/70">
      <div className="mb-4 flex items-center gap-2">
        {Icon && <Icon size={15} className="text-[#6f8a6f]" />}
        <h2 className="font-sans text-sm font-semibold uppercase tracking-wide text-neutral-900 dark:text-neutral-50">
          {title}
        </h2>
      </div>
      {children}
    </div>
  )
}

function RecentRequests() {
  const [requests, setRequests] = useState(null)

  useEffect(() => {
    let cancelled = false
    getMyRequests()
      .then((data) => {
        if (!cancelled) setRequests(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (!cancelled) setRequests([])
      })
    return () => { cancelled = true }
  }, [])

  return (
    <div>
      {requests === null ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="flex items-center gap-3 rounded-xl border border-dashed border-neutral-200 p-4 dark:border-neutral-700">
          <FileText size={18} className="shrink-0 text-neutral-300 dark:text-neutral-600" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No requests yet. Submit one and it will appear here.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {requests.slice(0, 3).map((req) => (
            <li key={req.id} className="rounded-xl border border-neutral-100 p-3 dark:border-neutral-800">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[13px] font-semibold text-neutral-900 dark:text-neutral-50">
                  {TYPE_LABEL[req.type] || req.type || `Request #${req.id}`}
                </p>
                <Badge text={req.status || 'PENDING'} variant={STATUS_VARIANT[req.status] || 'neutral'} />
              </div>
              <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-500">
                {formatDate(req.createdAt || req.created_at)}
              </p>
              {req.notes && (
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {req.notes}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/account"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#6f8a6f] transition-colors hover:text-[#55705a]"
      >
        View all requests <ArrowRight size={14} />
      </Link>
    </div>
  )
}

export default function CustomerRequestSidebar() {
  return (
    <div className="space-y-5">
      <SideCard title="How It Works">
        <ol className="space-y-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#8fa88f]/15 text-xs font-semibold text-[#6f8a6f]">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{step.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </SideCard>

      <SideCard title="Need Help?">
        <ul className="space-y-3">
          {HELP.map(({ icon: Icon, label, value, href }) => (
            <li key={label} className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#8fa88f]/15 text-[#6f8a6f]">
                <Icon size={16} />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-neutral-400 dark:text-neutral-500">{label}</p>
                {href ? (
                  <a href={href} className="text-sm font-medium text-neutral-900 transition-colors hover:text-[#6f8a6f] dark:text-neutral-100">
                    {value}
                  </a>
                ) : (
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{value}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </SideCard>

      <SideCard title="Your Recent Requests">
        <RecentRequests />
      </SideCard>
    </div>
  )
}