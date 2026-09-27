import { useSearchParams } from 'react-router-dom'
import { CalendarDays, Heart, KeyRound, Send, ShoppingBag, User } from 'lucide-react'

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
import AccountFavorites from '@/pages/public/account/AccountFavorites'
import AccountContactDelivery from '@/pages/public/account/AccountContactDelivery'
import AccountTabPlaceholder from '@/pages/public/account/AccountTabPlaceholder'
import { useCustomerOrders } from '@/hook/UseCustomerOrders'

import { ACCOUNT_TABS } from '@/pages/public/account/AccountData'

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

const DEFAULT_TAB = 'overview'

function PatientAccountPage() {
  // The active tab lives in the URL, not in component state. State was lost on
  // every refresh, so reloading /account always dropped the customer back on the
  // default tab no matter which one they were reading. A query param also makes
  // a tab linkable and puts the browser back button to work.
  //
  // Overview is the default because it is the account summary, and everything on
  // it is real now: orders, appointments and the prescription all come from the
  // API. It used to open on Order History instead, because Overview led with a
  // hard-coded lab progress bar for an order that did not exist - the tab a
  // customer actually needed was two clicks away and the first thing they saw
  // was fiction.
  const [searchParams, setSearchParams] = useSearchParams()
  const requested = searchParams.get('tab')
  const tab = ACCOUNT_TABS.some((entry) => entry.key === requested) ? requested : DEFAULT_TAB

  const setTab = (key) => {
    // replace, so working through the tabs does not fill the back button with
    // every click. Back then leaves the account page as expected.
    setSearchParams(key === DEFAULT_TAB ? {} : { tab: key }, { replace: true })
  }

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
                {/* The vision-benefits and care-pass cards were removed rather than
                    left as fixtures: the backend has no insurance, plan or loyalty
                    entity (14 models, none of them one of those), so they could
                    only ever show invented coverage percentages and a fake
                    membership number. Contact & Delivery below is real. */}
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
          ) : tab === 'appointments' ? (
            <div className="mt-6">
              <AccountAppointments />
            </div>
          ) : tab === 'saved' ? (
            <div className="mt-6">
              <AccountFavorites />
            </div>
          ) : (
            <AccountTabPlaceholder icon={blueprint.icon} title={blueprint.title} blurb={blueprint.blurb} />
          )}
        </div>
      </section>

      <HomeFooter />
    </div>
  )
}

export default PatientAccountPage