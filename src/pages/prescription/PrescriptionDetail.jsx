import { useParams, Link, useNavigate } from 'react-router-dom'
import { Printer, Pencil } from 'lucide-react'
import Button from '@/components/ui/Button'
import { usePrescriptions } from '@/hook/UsePrescription'
import { useCustomers } from '@/hook/UseCustomer'
import { getInitials, getAvatarColors } from '@/utils/avatar'
import { deriveMemberId, formatDate } from '@/utils/format'

const cardClass = 'rounded-2xl border border-gray-200 bg-white p-6 transition-colors duration-300 dark:border-neutral-800 dark:bg-[#1c1c28]'
const cardTitleClass = 'text-base font-semibold text-gray-900 dark:text-neutral-50'

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
            <span className="text-right text-gray-900 dark:text-neutral-100">{value ?? '—'}</span>
        </div>
    )
}



function PrescriptionDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { prescriptions, loading } = usePrescriptions()
    const { customers } = useCustomers()

    const prescription = prescriptions.find((p) => p.id === Number(id))

    if (loading || !prescription) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-center py-20 text-gray-500 dark:text-neutral-400">
                    Loading prescription...
                </div>
            </div>
        )
    }

    const customer = customers.find((c) => c.id === prescription.customer_id)

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
                            <Avatar name={customer?.name || '?'} id={customer?.id || prescription.customer_id} />
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
                            <InfoRow label="Date Issued" value={prescription.prescription_date ? formatDate(prescription.prescription_date) : '—'} />
                        </div>
                    </div>

                    <div className={cardClass}>
                        <h3 className={cardTitleClass}>Lens Values</h3>
                        <div className="mt-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="rounded-lg bg-gray-50 p-2 dark:bg-white/5">
                                    <p className="text-xs text-gray-500 dark:text-neutral-400">OD Sphere</p>
                                    <p className="font-medium text-gray-900 dark:text-neutral-100">{prescription.od_sphere ?? '—'}</p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-2 dark:bg-white/5">
                                    <p className="text-xs text-gray-500 dark:text-neutral-400">OS Sphere</p>
                                    <p className="font-medium text-gray-900 dark:text-neutral-100">{prescription.os_sphere ?? '—'}</p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-2 dark:bg-white/5">
                                    <p className="text-xs text-gray-500 dark:text-neutral-400">OD Cylinder</p>
                                    <p className="font-medium text-gray-900 dark:text-neutral-100">{prescription.od_cylinder ?? '—'}</p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-2 dark:bg-white/5">
                                    <p className="text-xs text-gray-500 dark:text-neutral-400">OS Cylinder</p>
                                    <p className="font-medium text-gray-900 dark:text-neutral-100">{prescription.os_cylinder ?? '—'}</p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-2 dark:bg-white/5">
                                    <p className="text-xs text-gray-500 dark:text-neutral-400">OD Axis</p>
                                    <p className="font-medium text-gray-900 dark:text-neutral-100">{prescription.od_axis ?? '—'}</p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-2 dark:bg-white/5">
                                    <p className="text-xs text-gray-500 dark:text-neutral-400">OS Axis</p>
                                    <p className="font-medium text-gray-900 dark:text-neutral-100">{prescription.os_axis ?? '—'}</p>
                                </div>
                            </div>
                            <div className="border-t border-gray-100 pt-3 dark:border-neutral-800">
                                <InfoRow label="Near Addition" value={prescription.near_addition ?? '—'} />
                                <InfoRow label="Pupillary Distance" value={prescription.pupillary_distance ?? '—'} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 lg:col-span-7">
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