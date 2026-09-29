import { Link } from 'react-router-dom'
import { ArrowLeft, CalendarPlus, Cake, Mail, MapPin, Pencil, Phone, Plus, UserRound } from 'lucide-react'

import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import DropdownMenu from '@/components/ui/DropdownMenu'
import { getAvatarColors, getInitials } from '@/utils/avatar'
import { deriveMemberId, formatDate, memberSince } from '@/utils/format'
import { birthDateOf, genderOf } from '@/pages/customers/customerDetailData'
import { card, metaLabel, metaValue } from '@/pages/customers/customerDetailStyles'

// The identity block at the top of the page: who this customer is, how to reach
// them, and the four actions staff reach for most. Everything below it is the
// customer's history, so this stays deliberately short.

function MetaItem({ icon: Icon, label, value }) {
  return (
    <div className="min-w-0">
      <p className={`${metaLabel} flex items-center gap-1.5`}>
        {Icon && <Icon size={12} aria-hidden="true" />}
        {label}
      </p>
      <p className={`${metaValue} ${label === 'Address' ? '' : 'truncate'}`} title={value || undefined}>
        {value || '—'}
      </p>
    </div>
  )
}

const STATUS_HINT_CLASS = 'text-xs text-gray-400 dark:text-neutral-500'

export default function CustomerProfileHeader({ customer, status, onNewOrder, onBookAppointment, onEdit, menuItems = [] }) {
  const { bg, text } = getAvatarColors(customer.id)

  return (
    <section className={card}>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 dark:border-neutral-800">
        <div className="flex min-w-0 items-center gap-4">
          <span
            className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold"
            style={{ backgroundColor: bg, color: text }}
            aria-hidden="true"
          >
            {getInitials(customer.name)}
          </span>

          <div className="min-w-0">
            <Link
              to="/dashboard/customers"
              className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors duration-300 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              <ArrowLeft size={12} />
              Customers
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-bold text-gray-900 dark:text-neutral-50">{customer.name}</h1>
              <Badge text={status.label} variant={status.variant} />
            </div>

            <p className={`mt-0.5 ${STATUS_HINT_CLASS}`}>
              {deriveMemberId(customer.id)} · {status.hint} · Member since {memberSince(customer.created_at)}
            </p>
          </div>
        </div>

        {/* On mobile the four actions collapse into the overflow menu so the
            name is never squeezed off screen. */}
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="primary" icon={<Plus size={16} />} onClick={onNewOrder}>
            New Order
          </Button>
          <Button variant="outline" icon={<CalendarPlus size={16} />} onClick={onBookAppointment}>
            Book Appointment
          </Button>
          <Button variant="outline" icon={<Pencil size={16} />} onClick={onEdit}>
            Edit
          </Button>
          <DropdownMenu items={menuItems} label={`More actions for ${customer.name}`} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 px-5 py-4 sm:grid-cols-3 lg:grid-cols-5">
        <MetaItem icon={UserRound} label="Gender" value={genderOf(customer)} />
        <MetaItem icon={Cake} label="Date of Birth" value={formatDate(birthDateOf(customer))} />
        <MetaItem icon={Phone} label="Phone" value={customer.phone} />
        <MetaItem icon={Mail} label="Email" value={customer.email} />
        <MetaItem icon={MapPin} label="Address" value={customer.address} />
      </div>

      <div className="flex items-center gap-2 border-t border-gray-100 px-5 py-3 md:hidden dark:border-neutral-800">
        <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={onNewOrder} className="flex-1">
          New Order
        </Button>
        <Button variant="outline" size="sm" icon={<CalendarPlus size={15} />} onClick={onBookAppointment} className="flex-1">
          Book
        </Button>
        <Button variant="outline" size="sm" icon={<Pencil size={15} />} onClick={onEdit}>
          Edit
        </Button>
        <DropdownMenu items={menuItems} label={`More actions for ${customer.name}`} />
      </div>
    </section>
  )
}
