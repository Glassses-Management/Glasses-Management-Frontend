import { useState } from 'react'
import { User, Mail, Phone } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import { useToast } from '@/hook/UseToast'
import { updateUser } from '@/api/userApi'
import { composeValidators, required, email, phone } from '@/utils/Validators'

export default function ProfileEditModal({ user, onClose, onSaved }) {
  const { success: toastSuccess, error: toastError } = useToast()
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSave = async () => {
    const nextErrors = {
      name: composeValidators(required)(form.name),
      phone: phone(form.phone),
      email: composeValidators(required, email)(form.email),
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    setSaving(true)
    try {
      await updateUser(user.id, { userName: form.name.trim(), phone: form.phone.trim(), email: form.email.trim() })
      toastSuccess('Profile updated successfully.')
      onSaved?.()
      onClose?.()
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to update profile'
      toastError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open onClose={onClose} title="Edit Profile" footer={
      <div className="flex items-center justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button loading={saving} onClick={handleSave}>Save Changes</Button>
      </div>
    }>
      <div className="space-y-4">
        <Field label="User Name" icon={User} name="name" required value={form.name} onChange={handleChange} error={errors.name} placeholder="John Doe" />
        <Field label="Phone" icon={Phone} name="phone" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="012 345 678" />
        <Field label="Email" icon={Mail} name="email" type="email" required value={form.email} onChange={handleChange} error={errors.email} placeholder="john@example.com" />
      </div>
    </Modal>
  )
}