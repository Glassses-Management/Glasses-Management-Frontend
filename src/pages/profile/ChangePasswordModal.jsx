import { useState } from 'react'
import { Lock, KeyRound } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import { useToast } from '@/hook/UseToast'
import { changePassword } from '@/api/authApi'
import { composeValidators, required, requiredPassword } from '@/utils/Validators'

export default function ChangePasswordModal({ onClose }) {
  const { success: toastSuccess, error: toastError } = useToast()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async () => {
    const nextErrors = {
      currentPassword: composeValidators(required)(form.currentPassword),
      newPassword: composeValidators(required, requiredPassword)(form.newPassword),
      confirmPassword: form.confirmPassword === form.newPassword ? '' : 'Passwords do not match',
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    setSaving(true)
    try {
      await changePassword(form.currentPassword, form.newPassword)
      toastSuccess('Password changed successfully.')
      onClose?.()
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to change password'
      toastError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open onClose={onClose} title="Change Password" footer={
      <div className="flex items-center justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button loading={saving} icon={<KeyRound size={15} />} onClick={handleSubmit}>Change Password</Button>
      </div>
    }>
      <div className="space-y-4">
        <Field label="Current Password" icon={Lock} name="currentPassword" type="password" required value={form.currentPassword} onChange={handleChange} error={errors.currentPassword} placeholder="••••••••" />
        <Field label="New Password" icon={Lock} name="newPassword" type="password" required value={form.newPassword} onChange={handleChange} error={errors.newPassword} placeholder="••••••••" helper="Minimum 6 characters." />
        <Field label="Confirm New Password" icon={Lock} name="confirmPassword" type="password" required value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} placeholder="••••••••" />
      </div>
    </Modal>
  )
}