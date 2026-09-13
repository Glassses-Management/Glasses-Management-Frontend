import { useState } from 'react'
import { Mail } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import { useToast } from '@/hook/UseToast'
import { updateUser } from '@/api/userApi'
import { composeValidators, required, email } from '@/utils/Validators'

export default function EmailEditModal({ user, onClose, onSaved }) {
  const { error: toastError } = useToast()
  const [emailValue, setEmailValue] = useState(user?.email || '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    setEmailValue(e.target.value)
    if (error) setError('')
  }

  const handleSave = async () => {
    const nextError = composeValidators(required, email)(emailValue)
    setError(nextError)
    if (nextError) return

    setSaving(true)
    try {
      await updateUser(user.id, {
        userName: user?.name,
        phone: user?.phone,
        email: emailValue.trim(),
      })
      onSaved?.()
      onClose?.()
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to update email'
      toastError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open onClose={onClose} title="Edit Email" footer={
      <div className="flex items-center justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button loading={saving} onClick={handleSave}>Save Email</Button>
      </div>
    }>
      <div className="space-y-4">
        <Field
          label="Email"
          icon={Mail}
          name="email"
          type="email"
          required
          value={emailValue}
          onChange={handleChange}
          error={error}
          placeholder="you@example.com"
          helper="Used to log in to your account."
        />
      </div>
    </Modal>
  )
}