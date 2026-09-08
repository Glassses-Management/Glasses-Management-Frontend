// Customer profile screen. Reads one customer by :id from mock data (nested
// appointments/prescriptions/orders shape) and derives all display-only values.

import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Badge, { getVariantFromStatus } from '@/components/ui/Badge'
import StatsCard from '@/components/ui/StatsCard'
import mockData from "@/mockData/mockCustomers.json";
import { getInitials, getAvatarColors } from '@/utils/avatar'
import {
  deriveMemberId,
  memberSince,
  formatDate,
  formatDateTime,
  formatCurrency,
  frameName,
  frameDescription,
} from '@/utils/format'

const cardClass = 'rounded-2xl border border-gray-200 bg-white p-6 transition-colors duration-300 dark:border-neutral-800 dark:bg-[#1c1c28]'
const cardTitleClass = 'text-base font-semibold text-gray-900 dark:text-neutral-50'
const cardLinkClass = 'text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors duration-300 dark:text-violet-400 dark:hover:text-violet-300'

const framesIcon = (
  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="6" cy="15" r="3.5" />
    <circle cx="18" cy="15" r="3.5" />
    <path d="M9.5 15h5" />
    <path d="m2.5 15 .5-6a2 2 0 0 1 2-2h3" />
    <path d="m21.5 15-1-6a2 2 0 0 0-2-2h-3" />
  </svg>
)

function Avatar({ name, id, size = 'size-16 text-lg' }) {
  const { bg, text } = getAvatarColors(id)
  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center rounded-full font-semibold`}
      style={{ backgroundColor: bg, color: text }}
    >
      {getInitials(name)}
    </span>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-gray-500 dark:text-neutral-400">{label}</span>
      <span className="text-right text-gray-900 dark:text-neutral-100">{value}</span>
    </div>
  )
}

function CardHeader({ title, action }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h3 className={cardTitleClass}>{title}</h3>
      {action}
    </div>
  )
}

function CustomerDetail() {
  const { id } = useParams()
  const customer = mockData.customers.find((c) => c.id === Number(id))

  const appointments = useMemo(
    () =>
      [...(customer?.appointments || [])].sort(
        (a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt),
      ),
    [customer],
  )

  const prescriptions = useMemo(
    () =>
      [...(customer?.prescriptions || [])].sort(
        (a, b) => new Date(b.prescription_date) - new Date(a.prescription_date),
      ),
    [customer],
  )

  const orders = useMemo(
    () =>
      [...(customer?.orders || [])].sort(
        (a, b) => new Date(b.order_date) - new Date(a.order_date),
      ),
    [customer],
  )

  if (!customer) {
    return <p className="text-sm text-gray-500 dark:text-neutral-400">Customer not found.</p>
  }

  const latestProvider = appointments[0]?.optometrist?.name
  const latestOrderStatus = orders[0]?.status || null
  const currentPrescription = prescriptions[0]

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const completedOrders = orders.filter((order) => order.status === 'COMPLETED').length
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0

  const orderItems = orders.flatMap((order) =>
    (order.items || []).map((item) => ({ ...item, order })),
  )

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-neutral-400">
        <Link to="/dashboard/customers" className="hover:text-gray-700 dark:text-neutral-300 dark:hover:text-neutral-100">
          Customers
        </Link>
        <span aria-hidden="true">/</span>
        <span className="font-medium text-gray-900 dark:text-neutral-100">{customer.name}</span>
        {latestOrderStatus && (
          <Badge text={latestOrderStatus} variant={getVariantFromStatus(latestOrderStatus)} />
        )}
        <div className="ml-auto flex flex-wrap gap-2">
          <Button variant="outline">Edit Profile</Button>
          <Button variant="outline">Book Appointment</Button>
          <Button variant="outline">Write Prescription</Button>
          <Button variant="primary">+ Log Dispensing Order</Button>
        </div>
      </nav>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
        <div className="space-y-6 lg:col-span-3">
          <div className={cardClass}>
            <div className="flex items-center gap-4">
              <Avatar name={customer.name} id={customer.id} />
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold text-gray-900 dark:text-neutral-50">{customer.name}</h2>
                <p className="text-sm text-gray-500 dark:text-neutral-400">{deriveMemberId(customer.id)}</p>
                <p className="text-xs text-gray-400 dark:text-neutral-500">Member since {memberSince(customer.createdAt)}</p>
              </div>
            </div>
            <div className="mt-6 space-y-3 border-t border-gray-100 pt-5 dark:border-neutral-800">
              <InfoRow label="Phone" value={customer.phone} />
              <InfoRow label="Email" value={customer.email} />
              <InfoRow label="Address" value={customer.address} />
              <InfoRow label="Date of Birth" value={formatDate(customer.dateOfBirth)} />
            </div>
          </div>

          <div className={cardClass}>
            <h3 className={cardTitleClass}>Vision Care Provider</h3>
            <p className="mt-4 text-lg font-semibold text-gray-900 dark:text-neutral-50">
              {latestProvider || 'No visits yet'}
            </p>
            <Link to={`/dashboard/customers/${customer.id}/care-history`} className={`mt-2 inline-block ${cardLinkClass}`}>
              View Care History
            </Link>
          </div>

          <div className={cardClass}>
            <h3 className={cardTitleClass}>Dispensing Telemetry</h3>
            <div className="mt-4 space-y-3">
              <StatsCard label="Lifetime Value" value={formatCurrency(totalRevenue)} />
              <StatsCard label="Completed Orders" value={completedOrders} />
              <StatsCard label="Avg. Order Value" value={formatCurrency(avgOrderValue)} />
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-7">
          <div className={cardClass}>
            <CardHeader
              title="Current Valid Prescription"
              action={
                currentPrescription && (
                  <span className="text-sm text-gray-500 dark:text-neutral-400">
                    Valid from {formatDate(currentPrescription.prescription_date)}
                  </span>
                )
              }
            />
            {currentPrescription ? (
              <>
                <table className="mt-4 w-full text-sm text-gray-900 dark:text-neutral-100">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500 dark:border-neutral-800 dark:text-neutral-500">
                      <th className="py-2 text-left font-medium">Eye</th>
                      <th className="py-2 text-right font-medium">Sphere</th>
                      <th className="py-2 text-right font-medium">Cylinder</th>
                      <th className="py-2 text-right font-medium">Axis</th>
                      <th className="py-2 text-right font-medium">Add</th>
                      <th className="py-2 text-right font-medium">PD</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 dark:border-neutral-800">
                      <td className="py-3 font-semibold text-gray-900 dark:text-neutral-50">OD</td>
                      <td className="py-3 text-right">{currentPrescription.od_sphere}</td>
                      <td className="py-3 text-right">{currentPrescription.od_cylinder}</td>
                      <td className="py-3 text-right">{currentPrescription.od_axis}&deg;</td>
                      <td className="py-3 text-right" rowSpan={2}>{currentPrescription.near_addition}</td>
                      <td className="py-3 text-right" rowSpan={2}>{currentPrescription.pupillary_distance}</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold text-gray-900 dark:text-neutral-50">OS</td>
                      <td className="py-3 text-right">{currentPrescription.os_sphere}</td>
                      <td className="py-3 text-right">{currentPrescription.os_cylinder}</td>
                      <td className="py-3 text-right">{currentPrescription.os_axis}&deg;</td>
                    </tr>
                  </tbody>
                </table>
                {currentPrescription.notes && (
                  <p className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600 transition-colors duration-300 dark:bg-white/5 dark:text-neutral-300">
                    <span className="font-medium">Notes:</span> {currentPrescription.notes}
                  </p>
                )}
              </>
            ) : (
              <p className="mt-4 text-sm text-gray-500 dark:text-neutral-400">No prescription on record.</p>
            )}
          </div>

          <div className={cardClass}>
            <CardHeader
              title="Dispensing Orders & Bespoke Frames"
              action={
                <Link to={`/dashboard/customers/${customer.id}/orders`} className={cardLinkClass}>
                  View Ordering History
                </Link>
              }
            />
            {orderItems.length > 0 ? (
              <ul className="mt-4 divide-y divide-gray-100 dark:divide-neutral-800">
                {orderItems.map((item, i) => (
                  <li key={`${item.order.id}-${item.id}-${i}`} className="flex items-center gap-4 py-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors duration-300 dark:bg-white/5 dark:text-neutral-400">
                      {framesIcon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-900 dark:text-neutral-100">{frameName(item.product)}</p>
                      <p className="truncate text-xs text-gray-500 dark:text-neutral-400">{frameDescription(item)}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <p className="font-semibold text-gray-900 dark:text-neutral-100">{formatCurrency(item.total_price)}</p>
                      <Badge text={item.order.status} variant={getVariantFromStatus(item.order.status)} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-gray-500 dark:text-neutral-400">No orders yet.</p>
            )}
          </div>

          <div className={cardClass}>
            <CardHeader
              title="Consultation & Exam Timeline"
              action={
                <Link to={`/dashboard/customers/${customer.id}/appointments/new`} className={cardLinkClass}>
                  + Schedule New Visit
                </Link>
              }
            />
            {appointments.length > 0 ? (
              <ul className="mt-4 divide-y divide-gray-100 dark:divide-neutral-800">
                {appointments.map((appt) => (
                  <li key={appt.id} className="flex items-start justify-between gap-4 py-3">
                    <div className="flex items-start gap-4">
                      <div className="w-16 shrink-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
                          {formatDate(appt.scheduledAt, { month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-neutral-500">
                          {formatDate(appt.scheduledAt, { year: 'numeric' })}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-neutral-100">{appt.notes || 'Consultation'}</p>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                          {appt.optometrist?.name} · {formatDateTime(appt.scheduledAt)}
                        </p>
                      </div>
                    </div>
                    <Badge text={appt.status} variant={getVariantFromStatus(appt.status)} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-gray-500 dark:text-neutral-400">No appointments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDetail