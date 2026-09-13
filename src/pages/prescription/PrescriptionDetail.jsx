// Prescription detail screen. Reads one prescription by :id from mock data,
// resolves the customer and line-item products, and shows a read-only summary
// with Edit and Print actions.

import { useParams, Link, useNavigate } from 'react-router-dom'
import { Printer, Pencil } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { usePrescriptions } from '@/hook/UsePrescription'
import { useCustomers } from '@/hook/UseCustomer'
import { getInitials, getAvatarColors } from '@/utils/avatar'
import { deriveMemberId, formatDate } from '@/utils/format'
import inventoryData from '@/mockData/mockInventory.json'

const cardClass = 'rounded-2xl border border-gray-200 bg-white p-6 transition-colors duration-300 dark:border-neutral-800 dark:bg-[#1c1c28]'
const cardTitleClass = 'text-base font-semibold text-gray-900 dark:text-neutral-50'

const STATUS_VARIANT = {
    Active: 'success',
    Completed: 'info',
    Expired: 'neutral',
}

const products = inventoryData.items
const productName = (id) => {
    const p = products.find((item) => item.id === id)
    return p ? `${p.brand} ${p.model}` : '—'
}
const productSku = (id) => {
    const p = products.find((item) => item.id === id)
    return p ? p.sku : '—'
}

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

function PrescriptionDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { prescriptions } = usePrescriptions()
    const { customers } = useCustomers()

    const prescription = prescriptions.find((p) => p.id === Number(id))
    const customer = prescription ? customers.find((c) => c.id === prescription.customerId) : null

    if (!prescription) {
        return <p className="text-sm text-gray-500 dark:text-neutral-400">Prescription not found.</p>
    }

    return (
        <div className="space-y-6">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-neutral-400">
                <Link to="/dashboard/prescriptions" className="hover:text-gray-700 dark:text-neutral-300 dark:hover:text-neutral-100">
                    Prescriptions
                </Link>
                <span aria-hidden="true">/</span>
                <span className="font-medium text-gray-900 dark:text-neutral-100">
                    RX-{String(prescription.id).padStart(5, '0')}
                </span>
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
                            <div className="flex items-center justify-between gap-3 text-sm">
                                <span className="text-gray-500 dark:text-neutral-400">Status</span>
                                <Badge text={prescription.status} variant={STATUS_VARIANT[prescription.status] || 'neutral'} />
                            </div>
                        </div>
                    </div>

                    <div className={cardClass}>
                        <h3 className={cardTitleClass}>Summary</h3>
                        <div className="mt-4 space-y-3">
                            <InfoRow label="Total Items" value={prescription.items.length} />
                            <InfoRow label="Total Quantity" value={prescription.items.reduce((sum, i) => sum + i.quantity, 0)} />
                        </div>
                    </div>
                </div>

                <div className="space-y-6 lg:col-span-7">
                    <div className={cardClass}>
                        <h3 className={cardTitleClass}>Dispensing Items</h3>
                        {prescription.items.length > 0 ? (
                            <table className="mt-4 w-full text-sm text-gray-900 dark:text-neutral-100">
                                <thead>
                                    <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500 dark:border-neutral-800 dark:text-neutral-500">
                                        <th className="py-2 text-left font-medium">Product</th>
                                        <th className="py-2 text-left font-medium">SKU</th>
                                        <th className="py-2 text-left font-medium">Dosage</th>
                                        <th className="py-2 text-right font-medium">Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prescription.items.map((item, i) => (
                                        <tr key={`${item.productId}-${i}`} className="border-b border-gray-100 dark:border-neutral-800">
                                            <td className="py-3 font-medium">{productName(item.productId)}</td>
                                            <td className="py-3 text-gray-500 dark:text-neutral-400">{productSku(item.productId)}</td>
                                            <td className="py-3">{item.dosage || '—'}</td>
                                            <td className="py-3 text-right">{item.quantity}</td>
                                        </tr>
                                    ))}
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