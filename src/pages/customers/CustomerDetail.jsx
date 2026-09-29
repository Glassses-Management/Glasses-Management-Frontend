import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AlertCircle, ClipboardList, FileText, Trash2 } from 'lucide-react'

import Button from '@/components/ui/Button'
import CreateAppointmentModal from '@/components/appointment/CreateAppointmentModal'
import { useToast } from '@/hook/UseToast'
import { useCustomers } from '@/hook/UseCustomer'
import { useCustomerDetail } from '@/hook/UseCustomerDetail'

import CustomerProfileHeader from '@/pages/customers/CustomerProfileHeader'
import CustomerSummaryCards from '@/pages/customers/CustomerSummaryCards'
import CustomerTabs from '@/pages/customers/CustomerTabs'
import ActivePrescriptionCard from '@/pages/customers/ActivePrescriptionCard'
import CustomerOrdersTable from '@/pages/customers/CustomerOrdersTable'
import CustomerRecordList from '@/pages/customers/CustomerRecordList'
import RxQuickSnapshot from '@/pages/customers/RxQuickSnapshot'
import CustomerNotesCard from '@/pages/customers/CustomerNotesCard'
import CustomerActivityTimeline from '@/pages/customers/CustomerActivityTimeline'
import { buildActivity, clinicalTags, staffObservation } from '@/pages/customers/customerDetailActivity'
import { customerStatus, lensSummary, summaryStats } from '@/pages/customers/customerDetailData'

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'orders', label: 'Orders' },
  { key: 'prescriptions', label: 'Prescriptions' },
  { key: 'appointments', label: 'Appointments' },
  { key: 'requests', label: 'Requests' },
]

// Names for the failed-load banner, so it can say which section is empty because
// of an error instead of because the customer has no records.
const SECTION_LABELS = {
  orders: 'orders',
  prescriptions: 'prescriptions',
  appointments: 'appointments',
  requests: 'clinical requests',
}

function FailedBanner({ failed }) {
  if (failed.length === 0) return null

  return (
    <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
      <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      <p>
        Could not load {failed.map((key) => SECTION_LABELS[key] || key).join(' and ')} for this customer. Those
        sections are empty rather than showing data that may be out of date.
      </p>
    </div>
  )
}

export default function CustomerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success: toastSuccess, error: toastError } = useToast()
  const { deleteCustomer } = useCustomers()

  const { customer, orders, prescriptions, appointments, requests, loading, failed, reload } = useCustomerDetail(id)
  const [tab, setTab] = useState('overview')
  const [booking, setBooking] = useState(false)

  const currentRx = prescriptions[0] || null

  // Every hook runs before the early return below, so moving between customers
  // never changes the hook order.
  const status = useMemo(() => customerStatus({ orders, appointments }), [orders, appointments])
  const stats = useMemo(
    () => summaryStats({ orders, appointments, requests }),
    [orders, appointments, requests],
  )
  const activity = useMemo(
    () => buildActivity({ customer, orders, appointments, prescriptions, requests, lensSummary }),
    [customer, orders, appointments, prescriptions, requests],
  )
  const tags = useMemo(() => clinicalTags({ prescriptions, orders }), [prescriptions, orders])
  const observation = useMemo(
    () => staffObservation({ prescriptions, appointments, orders }),
    [prescriptions, appointments, orders],
  )

  if (!customer) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-neutral-50">Customer not found</h1>
        <p className="text-sm text-gray-500 dark:text-neutral-400">
          No client matches id {id}. It may have been deleted from the registry.
        </p>
        <Link to="/dashboard/customers">
          <Button variant="outline">Back to Customers</Button>
        </Link>
      </div>
    )
  }

  // OrderCreate already accepts a prefill through router state
  // (pages/orders/OrderCreate.jsx), which is how the customer and the prescription
  // travel to the form.
  const startOrder = (prescriptionId) =>
    navigate('/dashboard/orders/new', { state: { customerId: customer.id, prescriptionId } })

  const handleDelete = async () => {
    const name = customer.name
    try {
      await deleteCustomer(customer.id)
      toastSuccess(`${name} was removed from the registry.`)
      navigate('/dashboard/customers')
    } catch (err) {
      const data = err?.response?.data
      toastError(data?.error || data?.message || 'Could not delete this customer.')
    }
  }

  const menuItems = [
    {
      label: 'Write Prescription',
      icon: <FileText size={14} />,
      onSelect: () => navigate('/dashboard/prescriptions/new'),
    },
    {
      label: 'Log Clinical Request',
      icon: <ClipboardList size={14} />,
      onSelect: () => navigate('/dashboard/requests/add'),
    },
    { label: 'Delete Customer', icon: <Trash2 size={14} />, danger: true, onSelect: handleDelete },
  ]

  const counts = {
    overview: null,
    orders: orders.length,
    prescriptions: prescriptions.length,
    appointments: appointments.length,
    requests: requests.length,
  }

  return (
    <div className="space-y-5">
      <CustomerProfileHeader
        customer={customer}
        status={status}
        onNewOrder={() => startOrder()}
        onBookAppointment={() => setBooking(true)}
        onEdit={() => navigate(`/dashboard/customers/${customer.id}/edit`)}
        menuItems={menuItems}
      />

      <FailedBanner failed={failed} />

      <CustomerSummaryCards stats={stats} loading={loading} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-8">
          <CustomerTabs tabs={TABS} active={tab} counts={counts} onChange={setTab} />

          {tab === 'overview' && (
            <>
              <ActivePrescriptionCard prescription={currentRx} onPrint={() => window.print()} />
              <CustomerOrdersTable orders={orders} limit={5} />
            </>
          )}

          {tab === 'orders' && <CustomerOrdersTable orders={orders} />}

          {tab === 'prescriptions' && <CustomerRecordList kind="prescription" items={prescriptions} />}

          {tab === 'appointments' && <CustomerRecordList kind="appointment" items={appointments} />}

          {tab === 'requests' && <CustomerRecordList kind="request" items={requests} />}
        </div>

        <aside className="space-y-5 xl:col-span-4">
          <RxQuickSnapshot
            prescription={currentRx}
            onDuplicateIntoOrder={() => startOrder(currentRx?.id)}
            onDownload={() => window.print()}
          />
          <CustomerNotesCard observation={observation} tags={tags} prescriptionId={currentRx?.id} />
          <CustomerActivityTimeline items={activity} />
        </aside>
      </div>

      <CreateAppointmentModal
        open={booking}
        customerId={customer.id}
        customerName={customer.name}
        context="Eye exam"
        onClose={() => setBooking(false)}
        onSaved={() => {
          setBooking(false)
          reload()
        }}
      />
    </div>
  )
}
