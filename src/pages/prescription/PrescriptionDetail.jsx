// Prescription detail screen. Reads one prescription by :id from the shared
// PrescriptionContext and resolves the customer + product names from the mock
// data. Read-only with Edit and Print actions.

import { useParams, Link, useNavigate } from 'react-router-dom'
import { Printer, Pencil } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { usePrescriptions } from '@/hook/UsePrescription'
import { getInitials, getAvatarColors } from '@/utils/avatar'
import { deriveMemberId, formatDate } from '@/utils/format'
import customerData from '@/mockData/mockCustomers.json'
import inventoryData from '@/mockData/mockInventory.json'

const cardClass = 'rounded-2xl border border-gray-200 bg-white p-6 transition-colors duration-300 dark:border-neutral-800 dark:bg-[#1c1c28]'
const cardTitleClass = 'text-base font-semibold text-gray-900 dark:text-neutral-50'

const STATUS_VARIANTS = { Active: 'success', Completed: 'info', Expired: 'warning' }

const prescriptionId = (id) => `RX-${String(id).padStart(5, '0')}`

function Avatar({ name, id }) {
    const { bg, text } = getAvatarColors(id)
    return (
        <span
            className="flex size-16 shrink-0 items-center justify-center rounded-full text-lg font-semibold"
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
            <span className="text-right text-gray-900 dark:text-neutral-100">{value ?? '—'}</span>
        </div>
    )
}

function PrescriptionDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { prescriptions } = usePrescriptions()

    const prescription = prescriptions.find((p) => p.id === Number(id))

    if (!prescription) {
        return (
            <section className="space-y-4">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-neutral-50">Prescription not found</h1>
                <p className="text-sm text-gray-500 dark:text-neutral-400">No prescription matches id {id}.</p>
                <Button variant="outline" onClick={() => navigate('/dashboard/prescriptions')}>Back to Prescriptions</Button>
            </section>
        )
    }

    const customers = customerData.customers
    const products = inventoryData.items
    const customer = customers.find((c) => c.id === prescription.customerId)
    const productById = (productId) => products.find((p) => p.id === productId)

    return (
        <div className="space-y-6">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-neutral-400">
                <Link to="/dashboard/prescriptions" className="hover:text-gray-700 dark:text-neutral-300 dark:hover:text-neutral-100">
                    Prescriptions
                </Link>
                <span aria-hidden="true">/</span>
                <span className="font-medium text-gray-900 dark:text-neutral-100">{prescriptionId(prescription.id)}</span>
                <Badge text={prescription.status} variant={STATUS_VARIANTS[prescription.status] || 'neutral'} />
                <div className="ml-auto flex flex-wrap gap-2">
                    <Button variant="outline" icon={<Printer size={14} />} onClick={() => window.print()}>Print</Button>
                    <Button variant="outline" icon={<Pencil size={14} />} onClick={() => navigate(`/dashboard/prescriptions/${prescription.id}/edit`)}>Edit</Button>
                </div>
            </nav>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
                <div className="space-y-6 lg:col-span-3">
                    <div className={cardClass}>
                        <div className="flex items-center gap-4">
                            <Avatar name={customer?.name || '?'} id={customer?.id || prescription.customerId} />
                            <div className="min-w-0">
                                <h2 className="truncate text-lg font-bold text-gray-900 dark:text-neutral-50">
                                    {customer?.name || 'Unknown customer'}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-neutral-400">
                                    {customer ? deriveMemberId(customer.id) : '—'}
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 space-y-3 border-t border-gray-100 pt-5 dark:border-neutral-800">
                            <InfoRow label="Doctor" value={prescription.doctorName} />
                            <InfoRow label="Date Issued" value={formatDate(prescription.dateIssued)} />
                            <InfoRow label="Status" value={prescription.status} />
                        </div>
                    </div>
                </div>

                <div className="space-y-6 lg:col-span-7">
                    <div className={cardClass}>
                        <h3 className={cardTitleClass}>Prescribed Items</h3>
                        {prescription.items?.length > 0 ? (
                            <table className="mt-4 w-full text-left text-sm text-gray-900 dark:text-neutral-100">
                                <thead>
                                    <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500 dark:border-neutral-800 dark:text-neutral-500">
                                        <th className="py-2 pr-3 font-medium">Product</th>
                                        <th className="py-2 pr-3 font-medium">Dosage</th>
                                        <th className="py-2 text-right font-medium">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prescription.items.map((item, index) => {
                                        const product = productById(item.productId)
                                        return (
                                            <tr key={`${item.productId}-${index}`} className="border-b border-gray-100 dark:border-neutral-800">
                                                <td className="py-3 pr-3">
                                                    <p className="font-medium text-gray-900 dark:text-neutral-100">
                                                        {product ? `${product.brand} ${product.model}` : `Product #${item.productId}`}
                                                    </p>
                                                    {product && (
                                                        <p className="text-xs text-gray-500 dark:text-neutral-400">
                                                            {product.sku} · {product.category}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="py-3 pr-3 text-gray-500 dark:text-neutral-400">{item.dosage || '—'}</td>
                                                <td className="py-3 text-right font-medium text-gray-900 dark:text-neutral-100">{item.quantity}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <p className="mt-4 text-sm text-gray-500 dark:text-neutral-400">No items on this prescription.</p>
                        )}
                    </div>

                    <div className={cardClass}>
                        <h3 className={cardTitleClass}>Notes</h3>
                        {prescription.notes ? (
                            <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600 transition-colors duration-300 dark:bg-white/5 dark:text-neutral-300">
                                {prescription.notes}
                            </p>
                        ) : (
                            <p className="mt-3 text-sm text-gray-500 dark:text-neutral-400">No notes on this prescription.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrescriptionDetail