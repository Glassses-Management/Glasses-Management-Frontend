import { UserRound } from 'lucide-react'
import Field from '@/components/ui/Field'
import Select from '@/components/ui/Select'
import Card from '@/components/ui/Card'

function BulkPrescriptionForm({ customers, form, errors, onChange }) {
  const customerOptions = [
    { value: '', label: 'Select customer...' },
    ...customers.map((c) => ({ value: c.id, label: c.name })),
  ]

  const fieldChange = (key) => (e) => onChange(key, e.target.value)

  return (
    <>
      <Card title="Patient Information">
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Select
            name="customer_id"
            label="Customer (no prescription yet)"
            required
            options={customerOptions}
            value={form.customer_id}
            onChange={fieldChange('customer_id')}
            error={errors.customer_id}
          />
          <Field
            label="Prescription Date"
            icon={UserRound}
            name="prescription_date"
            type="date"
            value={form.prescription_date}
            onChange={fieldChange('prescription_date')}
            error={errors.prescription_date}
          />
        </div>
      </Card>

      <Card title="Right Eye (OD)">
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field label="OD Sphere" icon={UserRound} name="od_sphere" type="number" step="0.25" required value={form.od_sphere} onChange={fieldChange('od_sphere')} error={errors.od_sphere} placeholder="-1.50" />
          <Field label="OD Cylinder" icon={UserRound} name="od_cylinder" type="number" step="0.25" value={form.od_cylinder} onChange={fieldChange('od_cylinder')} error={errors.od_cylinder} placeholder="-0.25" />
          <Field label="OD Axis" icon={UserRound} name="od_axis" type="number" min="0" max="180" value={form.od_axis} onChange={fieldChange('od_axis')} error={errors.od_axis} placeholder="180" />
        </div>
      </Card>

      <Card title="Left Eye (OS)">
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field label="OS Sphere" icon={UserRound} name="os_sphere" type="number" step="0.25" required value={form.os_sphere} onChange={fieldChange('os_sphere')} error={errors.os_sphere} placeholder="-1.25" />
          <Field label="OS Cylinder" icon={UserRound} name="os_cylinder" type="number" step="0.25" value={form.os_cylinder} onChange={fieldChange('os_cylinder')} error={errors.os_cylinder} placeholder="-0.50" />
          <Field label="OS Axis" icon={UserRound} name="os_axis" type="number" min="0" max="180" value={form.os_axis} onChange={fieldChange('os_axis')} error={errors.os_axis} placeholder="175" />
        </div>
      </Card>

      <Card title="Additional Values">
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Near Addition" icon={UserRound} name="near_addition" type="number" step="0.25" value={form.near_addition} onChange={fieldChange('near_addition')} error={errors.near_addition} placeholder="1.00" helper="Optional; for progressive/bifocal lenses" />
          <Field label="Pupillary Distance (mm)" icon={UserRound} name="pupillary_distance" type="number" step="0.5" value={form.pupillary_distance} onChange={fieldChange('pupillary_distance')} error={errors.pupillary_distance} placeholder="62" helper="Optional; distance between pupils in mm" />
        </div>
      </Card>

      <Card title="Notes">
        <div className="mt-5">
          <Field label="Notes" icon={UserRound} name="notes" value={form.notes} onChange={fieldChange('notes')} placeholder="Clinical notes for the dispensing team..." helper="Optional notes about the prescription." />
        </div>
      </Card>
    </>
  )
}

export default BulkPrescriptionForm