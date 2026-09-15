import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, Calendar, FileText, Send, Eye } from 'lucide-react'
import Field from '@/components/ui/Field'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { composeValidators, required } from '@/utils/Validators'
import { useToast } from '@/hook/UseToast'
import { useCustomers } from '@/hook/UseCustomer'
import { usePrescriptions } from '@/hook/UsePrescription'
import { useAuth } from '@/hook/UseAuth'
import { getAppointmentsByOptometrist, updateAppointment } from '@/api/appointmentApi'
import { createPrescription } from '@/api/prescriptionApi'
import { getOptometrists } from '@/api/userApi'

export default function OptometristPage() {
    const navigate = useNavigate()
    const { success: toastSuccess, error: toastError } = useToast()
    const { customers } = useCustomers()
    const { prescriptions, addPrescription } = usePrescriptions()
    const { user } = useAuth()

    const [activeTab, setActiveTab] = useState('appointments') // 'appointments' | 'prescriptions'
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)

    // Prescription form
    const [prescriptionForm, setPrescriptionForm] = useState({
        customer_id: '',
        user_id: '',
        od_sphere: '',
        od_cylinder: '',
        od_axis: '',
        os_sphere: '',
        os_cylinder: '',
        os_axis: '',
        near_addition: '',
        pupillary_distance: '',
        notes: '',
        prescription_date: new Date().toISOString().slice(0, 10),
    })
    const [prescriptionErrors, setPrescriptionErrors] = useState({})
    const [prescribing, setPrescribing] = useState(false)

    const customerById = {}
    customers.forEach((c) => { customerById[c.id] = c })

    useEffect(() => {
        let cancelled = false
        const load = async () => {
            try {
                const data = await getAppointmentsByOptometrist(user.id)
                if (!cancelled) {
                    setAppointments(Array.isArray(data) ? data : [])
                }
            } catch {
                if (!cancelled) setAppointments([])
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        void load()
        return () => { cancelled = true }
    }, [user?.id])

    const handleMarkComplete = async (appointmentId) => {
        try {
            await updateAppointment(appointmentId, { status: 'COMPLETED' })
            toastSuccess('Appointment marked as completed.')
            setAppointments((prev) => prev.map((a) => a.id === appointmentId ? { ...a, status: 'COMPLETED' } : a))
        } catch (err) {
            toastError(err?.response?.data?.message || err?.message || 'Failed to update appointment')
        }
    }

    const handleCreatePrescription = async (e) => {
        e.preventDefault()
        setPrescriptionErrors({})

        const nextErrors = {}
        if (!prescriptionForm.customer_id) nextErrors.customer_id = 'Select a customer'
        if (!prescriptionForm.od_sphere) nextErrors.od_sphere = 'OD Sphere is required'
        if (!prescriptionForm.os_sphere) nextErrors.os_sphere = 'OS Sphere is required'
        if (Object.values(nextErrors).some(Boolean)) return

        setPrescribing(true)
        try {
            await createPrescription({
                customer_id: Number(prescriptionForm.customer_id),
                user_id: prescriptionForm.user_id ? Number(prescriptionForm.user_id) : undefined,
                od_sphere: Number(prescriptionForm.od_sphere),
                od_cylinder: prescriptionForm.od_cylinder ? Number(prescriptionForm.od_cylinder) : undefined,
                od_axis: prescriptionForm.od_axis ? Number(prescriptionForm.od_axis) : undefined,
                os_sphere: Number(prescriptionForm.os_sphere),
                os_cylinder: prescriptionForm.os_cylinder ? Number(prescriptionForm.os_cylinder) : undefined,
                os_axis: prescriptionForm.os_axis ? Number(prescriptionForm.os_axis) : undefined,
                near_addition: prescriptionForm.near_addition ? Number(prescriptionForm.near_addition) : undefined,
                pupillary_distance: prescriptionForm.pupillary_distance ? Number(prescriptionForm.pupillary_distance) : undefined,
                notes: prescriptionForm.notes || undefined,
                prescription_date: prescriptionForm.prescription_date,
            })
            toastSuccess('Prescription recorded successfully.')
            setPrescriptionForm({
                customer_id: '',
                user_id: '',
                od_sphere: '',
                od_cylinder: '',
                od_axis: '',
                os_sphere: '',
                os_cylinder: '',
                os_axis: '',
                near_addition: '',
                pupillary_distance: '',
                notes: '',
                prescription_date: new Date().toISOString().slice(0, 10),
            })
        } catch (err) {
            toastError(err?.response?.data?.message || err?.message || 'Failed to create prescription')
        } finally {
            setPrescribing(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-50">Optometrist Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                    View appointments and record prescriptions after eye exams.
                </p>
            </div>

            {/* Tab navigation */}
            <div className="flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-neutral-800">
                {[
                    { key: 'appointments', label: 'My Appointments', icon: Calendar },
                    { key: 'prescriptions', label: 'Create Prescription', icon: Send },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === tab.key
                                ? 'bg-white text-[#1a1a2e] shadow-sm dark:bg-neutral-900 dark:text-neutral-50'
                                : 'text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-100'
                        }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
                <section>
                    {loading ? (
                        <div className="rounded-2xl bg-white p-10 text-center dark:bg-[#1c1c28]">Loading appointments...</div>
                    ) : (
                        <div className="space-y-4">
                            {appointments.length === 0 ? (
                                <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-neutral-800 dark:bg-[#1c1c28]">
                                    <Calendar size={48} className="mx-auto mb-4 text-gray-300 dark:text-neutral-600" />
                                    <p className="text-gray-500 dark:text-neutral-400">No appointments scheduled.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {appointments.map((apt) => (
                                        <div key={apt.id} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-neutral-800 dark:bg-[#1c1c28]">
                                            <div className="mb-4 flex items-center justify-between">
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-neutral-100">
                                                        Appointment #{apt.id}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-neutral-400">
                                                        {customerById[apt.customer_id]?.name || `Customer #${apt.customer_id}`}
                                                    </p>
                                                </div>
                                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    apt.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300' :
                                                    apt.status === 'COMPLETED' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300' :
                                                    'bg-gray-100 text-gray-600 dark:bg-neutral-700 dark:text-neutral-400'
                                                }`}>
                                                    {apt.status}
                                                </span>
                                            </div>
                                            <div className="space-y-2 text-sm">
                                                <p className="text-gray-500 dark:text-neutral-400">
                                                    {apt.scheduled_at ? new Date(apt.scheduled_at).toLocaleString() : 'Not scheduled'}
                                                </p>
                                            </div>
                                            {apt.status !== 'COMPLETED' && apt.status !== 'CANCELLED' && (
                                                <Button
                                                    size="sm"
                                                    variant="success"
                                                    icon={<CheckCircle size={14} />}
                                                    onClick={() => handleMarkComplete(apt.id)}
                                                >
                                                    Mark Complete
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </section>
            )}

            {/* Prescriptions Tab */}
            {activeTab === 'prescriptions' && (
                <section>
                    <Card title="Record Prescription">
                        <form onSubmit={handleCreatePrescription} className="space-y-4">
                            <Select
                                name="customer_id"
                                label="Customer"
                                required
                                options={[{ value: '', label: 'Select a customer...' }, ...customers.map((c) => ({ value: c.id, label: c.name }))]}
                                value={prescriptionForm.customer_id}
                                onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, customer_id: e.target.value }))}
                                error={prescriptionErrors.customer_id}
                            />
                            <Select
                                name="user_id"
                                label="Optometrist (you)"
                                options={[{ value: '', label: 'Select optometrist...' }, ...customers.filter((c) => c.role?.name === 'OPTOMETRIST' || c.role?.role === 'OPTOMETRIST').map((o) => ({ value: o.id, label: o.name || o.email || `#${o.id}` }))]}
                                value={prescriptionForm.user_id}
                                onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, user_id: e.target.value }))}
                            />
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Field label="OD Sphere" name="od_sphere" type="number" step="0.25" required value={prescriptionForm.od_sphere} onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, od_sphere: e.target.value }))} error={prescriptionErrors.od_sphere} placeholder="-1.50" />
                                <Field label="OD Cylinder" name="od_cylinder" type="number" step="0.25" value={prescriptionForm.od_cylinder} onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, od_cylinder: e.target.value }))} placeholder="-0.25" />
                                <Field label="OD Axis" name="od_axis" type="number" min="0" max="180" value={prescriptionForm.od_axis} onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, od_axis: e.target.value }))} placeholder="180" />
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Field label="OS Sphere" name="os_sphere" type="number" step="0.25" required value={prescriptionForm.os_sphere} onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, os_sphere: e.target.value }))} error={prescriptionErrors.os_sphere} placeholder="-1.00" />
                                <Field label="OS Cylinder" name="os_cylinder" type="number" step="0.25" value={prescriptionForm.os_cylinder} onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, os_cylinder: e.target.value }))} placeholder="-0.50" />
                                <Field label="OS Axis" name="os_axis" type="number" min="0" max="180" value={prescriptionForm.os_axis} onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, os_axis: e.target.value }))} placeholder="175" />
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Field label="Near Addition" name="near_addition" type="number" step="0.25" value={prescriptionForm.near_addition} onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, near_addition: e.target.value }))} placeholder="1.00" />
                                <Field label="Pupillary Distance (mm)" name="pupillary_distance" type="number" step="0.5" value={prescriptionForm.pupillary_distance} onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, pupillary_distance: e.target.value }))} placeholder="62" />
                            </div>
                            <Field label="Prescription Date" name="prescription_date" type="date" value={prescriptionForm.prescription_date} onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, prescription_date: e.target.value }))} />
                            <Field label="Notes" name="notes" value={prescriptionForm.notes} onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, notes: e.target.value }))} placeholder="Clinical notes..." />
                            <Button type="submit" loading={prescribing}>Record Prescription</Button>
                        </form>
                    </Card>
                </section>
            )}
        </div>
    )
}
