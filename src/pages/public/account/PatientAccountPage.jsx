import { useState } from 'react'
import { CalendarDays, Heart, KeyRound, Lock, Send, ShoppingBag, User } from 'lucide-react'

import Navbar from '@/components/layout/Navbar'
import HomeFooter from '@/pages/public/HomeFooter'
import AccountHeaderCard from '@/pages/public/account/AccountHeaderCard'
import AccountQuickStats from '@/pages/public/account/AccountQuickStats'
import AccountTabs from '@/pages/public/account/AccountTabs'
import AccountRefractionVault from '@/pages/public/account/AccountRefractionVault'
import AccountActiveOrder from '@/pages/public/account/AccountActiveOrder'
import AccountAppointments from '@/pages/public/account/AccountAppointments'
import AccountRequests from '@/pages/public/account/AccountRequests'
import AccountOrders from '@/pages/public/account/AccountOrders'
import AccountVisionBenefits from '@/pages/public/account/AccountVisionBenefits'
import AccountCarePass from '@/pages/public/account/AccountCarePass'
import AccountContactDelivery from '@/pages/public/account/AccountContactDelivery'
import AccountTabPlaceholder from '@/pages/public/account/AccountTabPlaceholder'
import { useCustomerOrders } from '@/hook/UseCustomerOrders'

import { ACCOUNT_TABS, COMPLIANCE } from '@/pages/public/account/AccountData'

const TAB_BLUEPRINTS = {
  requests: {
    icon: Send,
    title: 'My Requests',
    blurb: 'Product and eye exam requests you have submitted',
  },
  personal: {
    icon: User,
    title: 'Personal & Insurance',
    blurb:
      'Your personal details, emergency contacts and the vision insurance plan on file will live here once synced',
  },
  orders: {
    icon: ShoppingBag,
    title: 'Order History',
    blurb: 'Every verified purchase — frames, lenses and glazing services — will appear here with downloadable invoices',
  },
  appointments: {
    icon: CalendarDays,
    title: 'Appointments & Recalls',
    blurb: 'Confirmed visits, annual recalls and opt-in reminders will be collected here',
  },
  saved: {
    icon: Heart,
    title: 'Saved Eyewear',
    blurb: 'Frames you starred from the catalog will appear here for quick reorders and comparisons',
  },
  security: {
    icon: KeyRound,
    title: 'Security & MFA',
    blurb: 'Manage your password, login methods and multi-factor authentication for this account',
  },
}

function PatientAccountPage() {
  // Opens on Order History rather than Overview. Overview used to lead with a
  // hard-coded lab progress bar for an order that did not exist, so the tab a
  // customer actually needed was two clicks away and the first thing they saw
  // was fiction.
  const [tab, setTab] = useState('orders')
  const isOverview = tab === 'overview'
  const blueprint = isOverview ? null : TAB_BLUEPRINTS[tab]

  // Loaded once here and shared. The overview widgets and the order list all
  // need the same orders and appointments, so fetching per component would
  // repeat the identical requests.
  const customerOrders = useCustomerOrders()

  return (
    <div className="min-h-screen bg-mist-soft text-neutral-800 antialiased transition-colors duration-300 dark:bg-[#0E1A15] dark:text-neutral-200">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest dark:text-leaf">Patient Account</p>
        <h1 className="mt-3 font-sans font-semibold text-4xl text-neutral-900 md:text-5xl dark:text-neutral-50" data-aos="fade-up">
          Optical <span className="italic">Health Dashboard</span>
        </h1>
        <div className="mt-4 h-[3px] w-12 rounded-full bg-forest" />

        <div className="mt-6">
          <AccountHeaderCard />
          <AccountQuickStats orders={customerOrders.orders} />
          <AccountTabs tabs={ACCOUNT_TABS} active={tab} onChange={setTab} />

          {isOverview ? (
            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="min-w-0 space-y-6">
                <AccountRefractionVault />
                <AccountActiveOrder
                  orders={customerOrders.orders}
                  appointmentByOrder={customerOrders.appointmentByOrder}
                />
                <AccountAppointments />
              </div>
              <aside className="min-w-0 space-y-6">
                <AccountVisionBenefits />
                <AccountCarePass />
                <AccountContactDelivery />
              </aside>
            </div>
          ) : tab === 'requests' ? (
            <div className="mt-6">
              <AccountRequests />
            </div>
          ) : tab === 'orders' ? (
            <div className="mt-6">
              <AccountOrders {...customerOrders} />
            </div>
          ) : (
            <AccountTabPlaceholder icon={blueprint.icon} title={blueprint.title} blurb={blueprint.blurb} />
          )}

          <p className="mt-8 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-center text-xs text-neutral-400 dark:text-neutral-500">
            <Lock size={12} />
            {COMPLIANCE.label}:
            <span className="font-medium text-neutral-600 dark:text-neutral-400">{COMPLIANCE.value}</span>
            ·
            {COMPLIANCE.doctor}
          </p>
        </div>
      </section>

      <HomeFooter />
    </div>
  )
}

export default PatientAccountPage