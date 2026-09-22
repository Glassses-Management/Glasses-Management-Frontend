import { useEffect, useState } from 'react'
import { CalendarClock, ClipboardList, Package, Users } from 'lucide-react'
import { getAppointments } from '@/api/appointmentApi'
import { getCustomers } from '@/api/customerApi'
import { getOrders } from '@/api/orderApi'
import { getLowStock } from '@/api/inventoryApi'
import { getProducts } from '@/api/productApi'
import { useAuth } from '@/hook/UseAuth'
import ClinicianStatCard from '@/pages/staff/ClinicianStatCard'
import ClinicAppointmentsCard from '@/pages/staff/ClinicAppointmentsCard'
import ClinicLowStockCard from '@/pages/staff/ClinicLowStockCard'
import ClinicOrdersCard from '@/pages/staff/ClinicOrdersCard'

const dateLine = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

function greetingFor(name) {
  const hour = new Date().getHours()
  if (hour < 12) return `Good morning, ${name}`
  if (hour < 18) return `Good afternoon, ${name}`
  return `Good evening, ${name}`
}

function toList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  return []
}

function countToday(appointments) {
  const today = new Date().toDateString()
  return appointments.filter((a) => a?.scheduled_at && new Date(a.scheduled_at).toDateString() === today).length
}

function ClinicianDashboardPage() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [patientTotal, setPatientTotal] = useState(0)
  const [products, setProducts] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [appts, ord, cust, prod, low] = await Promise.all([
          getAppointments().catch(() => []),
          getOrders({ page: 0, size: 8, sort: 'id,desc' }).catch(() => ({ content: [] })),
          getCustomers({ page: 0, size: 100 }).catch(() => ({ content: [] })),
          getProducts({ page: 0, size: 100 }).catch(() => ({ content: [] })),
          getLowStock().catch(() => []),
        ])
        if (cancelled) return
        setAppointments(toList(appts))
        setOrders(toList(ord))
        setCustomers(toList(cust))
        setPatientTotal(cust?.totalElements ?? toList(cust).length)
        setProducts(toList(prod))
        setLowStock(toList(low))
      } catch (err) {
        console.error('ClinicianDashboardPage: failed to load:', err?.response?.status || err?.message || err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const staffName = user?.name || user?.email || 'there'
  const upcoming = appointments
    .filter((a) => a?.scheduled_at && new Date(a.scheduled_at) >= new Date())
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))
    .slice(0, 6)
  const pending = orders.filter((o) => o.status === 'PENDING').length

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-sans text-2xl font-semibold tracking-tight text-ink dark:text-neutral-50 md:text-3xl">
          {greetingFor(staffName)}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">{dateLine} · Clinic Overview</p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ClinicianStatCard
          icon={<CalendarClock size={17} />}
          label="Appointments Today"
          value={countToday(appointments)}
          delta={countToday(appointments) ? 'Scheduled for today' : 'No exams today'}
          deltaTone={countToday(appointments) ? 'good' : 'muted'}
        />
        <ClinicianStatCard
          icon={<Users size={17} />}
          label="Patients on Record"
          value={patientTotal}
          delta="Total customers"
          deltaTone="muted"
        />
        <ClinicianStatCard
          icon={<ClipboardList size={17} />}
          label="Pending Orders"
          value={pending}
          delta={pending ? 'Awaiting confirmation' : 'Nothing pending'}
          deltaTone={pending ? 'warn' : 'good'}
        />
        <ClinicianStatCard
          icon={<Package size={17} />}
          label="Low Stock Items"
          value={lowStock.length}
          delta={lowStock.length ? 'Need reordering' : 'Stock levels healthy'}
          deltaTone={lowStock.length ? 'bad' : 'good'}
        />
      </section>

      {loading ? (
        <div className="rounded-2xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm dark:bg-[#1c1c28] dark:text-neutral-400">
          Loading clinic overview...
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ClinicOrdersCard orders={orders} />
          </div>
          <div className="flex flex-col gap-4">
            <ClinicAppointmentsCard appointments={upcoming} customers={customers} />
            <ClinicLowStockCard items={lowStock} products={products} />
          </div>
        </section>
      )}
    </div>
  )
}

export default ClinicianDashboardPage