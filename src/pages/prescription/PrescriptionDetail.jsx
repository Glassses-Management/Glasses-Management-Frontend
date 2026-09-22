import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FileDown, Pencil, Printer, ShoppingBag } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import AxisOrientationCard from '@/components/prescription/AxisOrientationCard'
import RefractionCard from '@/components/prescription/RefractionCard'
import SavedFrameCard from '@/components/prescription/SavedFrameCard'
import { getUsers } from '@/api/userApi'
import { useCustomers } from '@/hook/UseCustomer'
import { usePrescriptions } from '@/hook/UsePrescription'
import { useToast } from '@/hook/UseToast'
import { deriveMemberId, formatDate } from '@/utils/format'

const cardClass = 'rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#1c1c28]'
const toList = (data) => (Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [])

function InfoItem({ label, children }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-neutral-500">{label}</p>
      <div className="mt-1">{children}</div>
    </div>
  )
}

function PrescriptionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { show: toastShow } = useToast()
  const { prescriptions, loading } = usePrescriptions()
  const { customers } = useCustomers()
  const [users, setUsers] = useState([])

  useEffect(() => {
    let cancelled = false
    getUsers()
      .then((data) => {
        if (!cancelled) setUsers(toList(data))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const prescription = prescriptions.find((p) => p.id === Number(id))
  const customer = prescription ? customers.find((c) => c.id === prescription.customer_id) : null
  const doctor = prescription?.user_id ? users.find((u) => u.id === prescription.user_id) : null

  if (loading || !prescription) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-500 dark:text-neutral-400">
        Loading prescription...
      </div>
    )
  }

  const rxId = `RX-${String(prescription.id).padStart(5, '0')}`
  const goOrder = () =>
    navigate('/dashboard/orders/new', { state: { customerId: customer?.id, prescriptionId: prescription.id } })

  const downloadPdf = () => {
    window.print()
    toastShow('Use "Save as PDF" in the print dialog to export.', 'info')
  }

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/dashboard/prescriptions"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
            Prescriptions
          </Link>
          <span aria-hidden="true" className="text-gray-300 dark:text-neutral-600">/</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-neutral-50">{rxId}</span>
          <Badge variant="success">Valid Prescription</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" icon={<Printer size={14} />} onClick={() => window.print()}>Print</Button>
          <Button variant="ghost" size="sm" icon={<FileDown size={14} />} onClick={downloadPdf}>Download PDF</Button>
          <Button variant="outline" size="sm" icon={<Pencil size={14} />} onClick={() => navigate(`/dashboard/prescriptions/${prescription.id}/edit`)}>Edit</Button>
          <Button variant="forest" size="sm" icon={<ShoppingBag size={14} />} onClick={goOrder}>Order Glasses</Button>
        </div>
      </nav>

      <section className={cardClass}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={customer?.name || '?'} id={customer?.id || prescription.customer_id} size="size-16 text-lg" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-lg font-bold text-gray-900 dark:text-neutral-50">
                  {customer?.name || 'Unknown customer'}
                </h1>
                <Badge variant="success">Verified</Badge>
              </div>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-neutral-400">
                {customer ? deriveMemberId(customer.id) : '—'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-gray-100 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0 xl:grid-cols-4">
            <InfoItem label="Member ID">
              <p className="text-sm font-medium text-gray-900 dark:text-neutral-50">{customer ? deriveMemberId(customer.id) : '—'}</p>
            </InfoItem>
            <InfoItem label="Examined On">
              <p className="text-sm font-medium text-gray-900 dark:text-neutral-50">
                {prescription.prescription_date ? formatDate(prescription.prescription_date) : '—'}
              </p>
            </InfoItem>
            <InfoItem label="Optometrist">
              <div className="flex items-center gap-2">
                <Avatar name={doctor?.name} id={doctor?.id} size="size-6 text-xs" />
                <p className="truncate text-sm font-medium text-gray-900 dark:text-neutral-50">{doctor?.name || '—'}</p>
              </div>
            </InfoItem>
            <InfoItem label="Valid Through">
              <p className="text-sm font-medium text-gray-900 dark:text-neutral-50">—</p>
            </InfoItem>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RefractionCard prescription={prescription} />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <AxisOrientationCard prescription={prescription} />
          <SavedFrameCard customerId={customer?.id} prescriptionId={prescription.id} />
        </div>
      </div>
    </div>
  )
}

export default PrescriptionDetail