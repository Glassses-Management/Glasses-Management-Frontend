import { useCallback, useEffect, useState } from 'react'
import { Pencil, KeyRound, RefreshCw, ShoppingBag, CalendarDays, Hash, Phone, Shield } from 'lucide-react'
import { useAuth } from '@/hook/UseAuth'
import { useToast } from '@/hook/UseToast'
import HomeHeader from '@/pages/public/HomeHeader'
import HomeFooter from '@/pages/public/HomeFooter'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import AvatarUploadSection from '@/pages/profile/AvatarUploadSection'
import ProfileEditModal from '@/pages/profile/ProfileEditModal'
import ChangePasswordModal from '@/pages/profile/ChangePasswordModal'
import MyRequestsSection from '@/pages/profile/MyRequestsSection'
import { getOrders } from '@/api/orderApi'
import { formatCurrency } from '@/utils/FormatCurrency'
import { formatDate } from '@/utils/FormatDate'

const toLabel = (value) =>
  String(value || '')
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

const splitName = (name) => {
  const parts = String(name || '').trim().split(/\s+/)
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' '),
  }
}

function DetailRow({ icon: Icon, label, value }) {
  const hasValue = Boolean(value)
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest/10 text-forest dark:bg-leaf/10 dark:text-leaf">
        <Icon size={16} />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 dark:text-neutral-500">{label}</p>
        <p className={`truncate text-sm font-medium ${hasValue ? 'text-ink dark:text-neutral-100' : 'text-gray-300 dark:text-neutral-600'}`}>
          {value || '—'}
        </p>
      </div>
    </div>
  )
}

function MyAccountPage() {
  const { user, getUser } = useAuth()
  const { success: toastSuccess } = useToast()
  const [profile, setProfile] = useState(user || null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [infoOpen, setInfoOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [orders, setOrders] = useState(null)
  const [orderTotal, setOrderTotal] = useState(0)

  const customerId = user?.customer_id ?? user?.id

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setLoadError('')
      try {
        const me = await getUser()
        if (!cancelled) setProfile(me)
      } catch {
        if (!cancelled) setLoadError('Could not load your account. Please try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [getUser])

  useEffect(() => {
    if (!customerId) return
    let cancelled = false
    getOrders({ page: 0, size: 5, sort: 'id,desc', customerId })
      .then((data) => {
        if (cancelled) return
        setOrders(Array.isArray(data?.content) ? data.content : [])
        setOrderTotal(data?.totalElements ?? 0)
      })
      .catch((err) => {
        if (cancelled) return
        console.error('MyAccountPage: failed to load orders:', err?.response?.status || err?.message || err)
        setOrders([])
      })
    return () => { cancelled = true }
  }, [customerId])

  const refreshProfile = useCallback(async () => {
    try {
      const me = await getUser()
      setProfile(me)
    } catch {
      setLoadError('Could not load your account. Please try again.')
    }
  }, [getUser])

  const handleSaved = async () => {
    await refreshProfile()
    toastSuccess('Account updated successfully.')
  }

  const { firstName, lastName } = splitName(profile?.name)
  const role = profile?.role?.name || profile?.role?.role || profile?.role || ''
  const memberSince = formatDate(profile?.created_at || profile?.createdAt || profile?.date_created)

  return (
    <div className="min-h-screen bg-white text-neutral-800 antialiased transition-colors duration-300 dark:bg-[#0E1A15] dark:text-neutral-200">
      <HomeHeader />

      <section className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest dark:text-leaf">My Account</p>
        <h1 className="mt-3 font-sans font-semibold text-4xl text-neutral-900 dark:text-neutral-50 md:text-5xl">
          Your <span className="italic">Details</span>
        </h1>
        <div className="mt-4 h-[3px] w-12 rounded-full bg-forest" />

        {loading ? (
          <div className="mt-8 space-y-5">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100 dark:bg-[#16271F]" />
            ))}
          </div>
        ) : loadError ? (
          <div className="mt-10 flex flex-col items-center text-center">
            <p className="mb-4 text-sm font-medium text-gray-500 dark:text-neutral-400">{loadError}</p>
            <Button variant="outline" icon={<RefreshCw size={15} />} onClick={refreshProfile}>Try Again</Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-10 lg:grid-cols-3">
            {/* Left column: profile info */}
            <div className={customerId ? 'min-w-0 lg:order-1 lg:col-span-2' : 'min-w-0 lg:col-span-3'}>
              <div className="divide-y divide-gray-100 dark:divide-neutral-800">
                {/* Profile picture */}
                <section className="py-5">
                  <AvatarUploadSection userId={profile?.id} name={profile?.name} />
                </section>

                {/* Name fields */}
                <section className="py-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-ink dark:text-neutral-100">Name</p>
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-neutral-500">Your display name and contact info</p>
                    </div>
                    <Button variant="outline" size="sm" icon={<Pencil size={14} />} onClick={() => setInfoOpen(true)}>
                      Edit Information
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input label="First Name" name="first_name" value={firstName} readOnly />
                    <Input label="Last Name" name="last_name" value={lastName} readOnly />
                  </div>
                </section>

                {/* Account details */}
                <section className="py-5">
                  <p className="text-sm font-semibold text-ink dark:text-neutral-100">Account Details</p>
                  <p className="mt-0.5 mb-4 text-xs text-gray-400 dark:text-neutral-500">Role, contact and membership info</p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <DetailRow icon={Shield} label="Role" value={toLabel(role)} />
                    <DetailRow icon={Phone} label="Phone" value={profile?.phone} />
                    <DetailRow icon={Hash} label="Account ID" value={profile?.id != null ? `#${profile.id}` : ''} />
                    <DetailRow icon={CalendarDays} label="Member since" value={memberSince} />
                  </div>
                </section>

                {/* Password */}
                <section className="flex flex-wrap items-start justify-between gap-4 py-5">
                  <div>
                    <p className="text-sm font-semibold text-ink dark:text-neutral-100">Password</p>
                    <p className="mt-1 text-xs text-gray-400 dark:text-neutral-500">
                      Log in with your password instead of using temporary login codes
                    </p>
                  </div>
                  <Button variant="outline" icon={<KeyRound size={15} />} onClick={() => setPasswordOpen(true)}>
                    Change Password
                  </Button>
                </section>

                {/* My Requests */}
                <MyRequestsSection />
              </div>
            </div>

            {/* Right column: order history */}
            {customerId && (
              <aside className="lg:order-2 lg:col-span-1">
                <div className="lg:sticky lg:top-6">
                  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#16271F]">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-ink dark:text-neutral-100">Order History</p>
                      {orderTotal > 0 && (
                        <span className="rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:bg-white/5 dark:text-neutral-400">
                          {orderTotal} total
                        </span>
                      )}
                    </div>
                    <p className="mb-3 text-xs text-gray-400 dark:text-neutral-500">Your most recent purchases</p>

                    {orders === null ? (
                      <p className="rounded-lg bg-gray-50 py-6 text-center text-sm text-gray-400 dark:bg-white/5 dark:text-neutral-500">
                        Loading orders…
                      </p>
                    ) : orders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-gray-50 py-8 text-center dark:bg-white/5">
                        <ShoppingBag size={20} className="text-gray-300 dark:text-neutral-600" />
                        <p className="text-sm text-gray-400 dark:text-neutral-500">No orders yet</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100 dark:divide-neutral-800">
                        {orders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-ink dark:text-neutral-100">Order #{order.id}</p>
                              <p className="mt-0.5 text-xs text-gray-400 dark:text-neutral-500">
                                {formatDate(order.order_date || order.created_at)}
                              </p>
                            </div>
                            <div className="flex shrink-0 flex-col items-end gap-1">
                              <span className="text-sm font-semibold text-ink dark:text-neutral-100">
                                {formatCurrency(order.total)}
                              </span>
                              <Badge text={order.status} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            )}
          </div>
        )}
      </section>

      {infoOpen && (
        <ProfileEditModal
          user={profile}
          onClose={() => setInfoOpen(false)}
          onSaved={handleSaved}
        />
      )}
      {passwordOpen && (
        <ChangePasswordModal
          onClose={() => setPasswordOpen(false)}
        />
      )}

      <HomeFooter />
    </div>
  )
}

export default MyAccountPage