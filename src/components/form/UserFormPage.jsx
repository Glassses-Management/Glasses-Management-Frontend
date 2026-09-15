import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { User, Mail, Lock, Phone } from 'lucide-react'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import { composeValidators, required, email, requiredPassword } from '@/utils/Validators'
import { useToast } from '@/hook/UseToast'
import { createUser, updateUser, getUserById } from '@/api/userApi'

const ROLES = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'STAFF', label: 'Staff' },
  { value: 'OPTOMETRIST', label: 'Optometrist' },
  { value: 'CUSTOMER', label: 'Customer' },
]

export default function UserFormPage({ onNavigate }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success: toastSuccess, error: toastError } = useToast()
  const isEdit = Boolean(id) && id !== 'new'

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit && id) {
      const loadUser = async () => {
        try {
          const user = await getUserById(id)
          setForm({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            password: '',
            confirmPassword: '',
            role: user.role?.name || user.role?.role || user.role || '',
          })
        } catch (err) {
          console.error('Failed to load user:', err)
          toastError('Failed to load user data.')
onNavigate?.('users')
        } finally {
          setLoading(false)
        }
      }
      loadUser()
    }
  }, [isEdit, id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const nextErrors = {
      name: composeValidators(required)(form.name),
      email: composeValidators(required, email)(form.email),
      role: required(form.role) ? 'Please select a role' : '',
    }
    if (!isEdit) {
      nextErrors.password = composeValidators(requiredPassword)(form.password)
      if (form.password !== form.confirmPassword) {
        nextErrors.confirmPassword = 'Passwords do not match'
      }
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some((error) => error)) return

    try {
      const payload = { userName: form.name, phone: form.phone || '', email: form.email, role: form.role }
      if (!isEdit) {
        payload.password_hash = form.password
      }

      if (isEdit) {
        await updateUser(id, payload)
        toastSuccess('User updated successfully.')
      } else {
        await createUser(payload)
        toastSuccess('User created successfully.')
      }
      navigate('/dashboard/users')
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Operation failed'
      toastError(msg)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-neutral-50">Loading user...</h1>
        <div className="space-y-4 p-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800" />
          ))}
        </div>
      </div>
    )
  }

  const goBack = isEdit ? `/dashboard/users/${id}` : '/dashboard/users'
  const pageTitle = isEdit ? 'Edit User' : 'New User'
  const pageSubtitle = isEdit
    ? 'Update the user details and role.'
    : 'Create a new user account and assign a role.'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400">
        <Link to="/dashboard/users" className="group inline-flex items-center gap-1.5 font-medium transition-colors hover:text-gray-700 dark:hover:text-neutral-100">
          Users
        </Link>
        <span aria-hidden="true" className="text-gray-300 dark:text-neutral-600">/</span>
        <span className="font-medium text-gray-900 dark:text-neutral-50">{pageTitle}</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-neutral-50">{pageTitle}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">{pageSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card title="Account Details" className="md:col-span-2">
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Name" icon={User} name="name" required value={form.name} onChange={handleChange} error={errors.name} placeholder="John Doe" />
            <Field label="Email" icon={Mail} name="email" type="email" required value={form.email} onChange={handleChange} error={errors.email} placeholder="john@example.com" />
            {isEdit && (
              <Field label="Phone" icon={Phone} name="phone" value={form.phone} onChange={handleChange} placeholder="012 345 678" />
            )}
            {!isEdit && (
              <>
                <Field label="Password" icon={Lock} name="password" type="password" required value={form.password} onChange={handleChange} error={errors.password} placeholder="••••••••" helper="Minimum 6 characters." />
                <Field label="Confirm Password" icon={Lock} name="confirmPassword" type="password" required value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} placeholder="••••••••" />
              </>
            )}
            <Select
              label="Role"
              name="role"
              required
              options={ROLES}
              value={form.role}
              onChange={handleChange}
              error={errors.role}
              placeholder="Select a role..."
            />
          </div>
        </Card>
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 border-t border-gray-200/60 bg-white/80 px-4 py-4 backdrop-blur-md dark:border-neutral-800 dark:bg-[#1c1c28]/80 md:-mx-6 md:px-6 md:py-5">
        <div className="flex items-center justify-between gap-3">
          <p className="hidden text-xs text-gray-400 dark:text-neutral-500 sm:block">
            {isEdit ? 'Changes apply immediately.' : 'New users appear in the list right away.'}
          </p>
          <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" onClick={() => onNavigate?.(goBack)}>Cancel</Button>
            <Button type="submit">{isEdit ? 'Save Changes' : 'Create User'}</Button>
          </div>
        </div>
      </div>
    </form>
  )
}
