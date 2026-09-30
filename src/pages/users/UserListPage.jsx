import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { Search, Users, Trash2, Mail, User, Phone, Lock, Camera } from 'lucide-react'
import { getUsers, deleteUser, updateUser, createUser } from '@/api/userApi'
import { getAttachmentsByUser, uploadAttachment } from '@/api/attachmentApi'
import { pickImage } from '@/components/product/productImageUtils'
import { useDebounce } from '@/hook/UseDebounce'
import { useToast } from '@/hook/UseToast'
import Field from '@/components/ui/Field'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import Pagination from '@/components/ui/Pagination'
import { formatDate } from '@/utils/FormatDate'
import { newUserPassword, userName } from '@/utils/Validators'
import { ROLE_OPTIONS } from '@/utils/Roles'

const PAGE_SIZE = 10

export default function UserListPage({ onNavigate }) {
  const [users, setUsers] = useState([])
  const [avatars, setAvatars] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [editAvatar, setEditAvatar] = useState('')
  const [avatarUploading, setAvatarUploading] = useState(false)
  const editAvatarInputRef = useRef(null)
  const [deleting, setDeleting] = useState(null)
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [editError, setEditError] = useState('')
  const { success: toastSuccess, error: toastError } = useToast()

  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '' })
  const [errors, setErrors] = useState({})
  const [createForm, setCreateForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: '' })
  const [createErrors, setCreateErrors] = useState({})

  const debouncedSearch = useDebounce(search)

  // GET /api/user is not pageable - it accepts no query parameters and returns the
  // whole list (API_DOCUMENT.md: only customers, products, orders and attachments
  // support Pageable). The previous version sent page/size/sort/search anyway and
  // rendered the response unfiltered, so the pager re-fetched the identical list
  // and the search box matched nothing. Searching and paging are done here.
  const fetchUsers = useCallback(async () => getUsers(), [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const data = await fetchUsers()
        if (cancelled) return
        setUsers(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('UserListPage: failed to load users:', err?.response?.status || err?.message || err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [fetchUsers])

  const refresh = async () => {
    setLoading(true)
    try {
      const data = await fetchUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('UserListPage: failed to refresh users:', err?.response?.status || err?.message || err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (users.length === 0) return
    let cancelled = false
    const loadAvatars = async () => {
      const entries = await Promise.all(
        users.map(async (u) => {
          try {
            const atts = await getAttachmentsByUser(u.id)
            return [u.id, pickImage(atts)?.filePath || '']
          } catch {
            return [u.id, '']
          }
        }),
      )
      if (!cancelled) setAvatars(Object.fromEntries(entries))
    }
    loadAvatars()
    return () => { cancelled = true }
  }, [users])

  const handleRowClick = (id) => {
    onNavigate?.(`users/${id}`)
  }

  const handleDelete = async () => {
    if (!deleting) return
    setDeleteError('')
    try {
      await deleteUser(deleting)
      setDeleting(null)
      refresh()
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to delete user'
      setDeleteError(msg)
      console.error('UserListPage: failed to delete user:', msg)
    }
  }

  const handleEditOpen = (user) => {
    setEditing(user)
    setEditError('')
    setEditAvatar(avatars[user.id] || '')
    setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '', role: user.role?.name || user.role?.role || user.role || '' })
    setErrors({})
  }

  const handleEditClose = () => {
    setEditing(null)
    setEditError('')
    setEditAvatar('')
    setForm({ name: '', email: '', phone: '', role: '' })
    setErrors({})
  }

  const handleEditAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !editing) return
    setAvatarUploading(true)
    try {
      await uploadAttachment({ file, userId: editing.id })
      const atts = await getAttachmentsByUser(editing.id)
      const path = pickImage(atts)?.filePath || ''
      setEditAvatar(path)
      setAvatars((prev) => ({ ...prev, [editing.id]: path }))
      toastSuccess('Profile picture updated successfully.')
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to upload picture'
      toastError(msg)
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleEditSave = async () => {
    if (!editing) return
    setEditError('')
    const nextErrors = {
      name: (form.name.trim() ? '' : 'Name is required'),
      email: (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'Enter a valid email' : ''),
      role: (form.role ? '' : 'Please select a role'),
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some((e) => e)) return

    try {
      const payload = { userName: form.name, phone: form.phone || '', email: form.email, role: form.role }
      await updateUser(editing.id, payload)
      toastSuccess('User updated successfully.')
      handleEditClose()
      refresh()
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to update user'
      setEditError(msg)
      toastError(msg)
    }
  }

  const handleCreateOpen = () => {
    setCreating(true)
    setCreateForm({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: '' })
    setCreateErrors({})
  }

  const handleCreateClose = () => {
    setCreating(false)
    setCreateForm({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: '' })
    setCreateErrors({})
  }

  const handleCreateSave = async () => {
    const nextErrors = {
      name: userName(createForm.name),
      email: (!createForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createForm.email) ? 'Enter a valid email' : ''),
      phone: (createForm.phone.trim() && /^[0-9+\-\s()]{7,15}$/.test(createForm.phone.trim()) ? '' : 'Enter a valid phone number'),
      password: newUserPassword(createForm.password),
      confirmPassword: (createForm.confirmPassword !== createForm.password ? 'Passwords do not match' : ''),
      role: (createForm.role ? '' : 'Please select a role'),
    }
    setCreateErrors(nextErrors)
    if (Object.values(nextErrors).some((e) => e)) return

    try {
      await createUser({ userName: createForm.name.trim(), email: createForm.email, phone: createForm.phone.trim(), role: createForm.role, password_hash: createForm.password })
      toastSuccess('User created successfully.')
      handleCreateClose()
      refresh()
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to create user'
      toastError(msg)
    }
  }

  const getRoleLabel = (user) => {
    if (!user) return '—'
    if (typeof user.role === 'string') return user.role
    if (typeof user.role?.name === 'string') return user.role.name
    if (typeof user.role?.role === 'string') return user.role.role
    if (typeof user.role?.authority === 'string') return user.role.authority
    if (Array.isArray(user.roles)) return user.roles.map((r) => r?.name || r?.role || String(r)).join(', ')
    if (Array.isArray(user.authorities)) return user.authorities.map((a) => a?.authority || a?.role || String(a)).join(', ')
    return '—'
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
  }

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) =>
      String(u.name || '').toLowerCase().includes(q) ||
      String(u.email || '').toLowerCase().includes(q) ||
      getRoleLabel(u).toLowerCase().includes(q) ||
      String(u.phone || '').toLowerCase().includes(q) ||
      `#${u.id}`.includes(q),
    )
  }, [users, debouncedSearch])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  // Clamped, so deleting the last row on a page cannot leave it empty.
  const effectivePage = Math.min(currentPage, totalPages)
  const paged = filtered.slice((effectivePage - 1) * PAGE_SIZE, effectivePage * PAGE_SIZE)

  // A new search means a new result set, so go back to the first page. Done
  // during render (a React-sanctioned state adjustment) rather than in an effect,
  // which would show one frame of the wrong page.
  const [lastSearch, setLastSearch] = useState(debouncedSearch)
  if (lastSearch !== debouncedSearch) {
    setLastSearch(debouncedSearch)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-ink dark:text-neutral-50">Users</h1>
          <p className="text-sm text-gray-400 dark:text-neutral-500">Manage user accounts and roles</p>
        </div>
        <Button
          icon={<Users size={18} />}
          onClick={handleCreateOpen}
        >
          Add User
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or role..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-surface-ink outline-none transition-colors focus:border-sage dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-sage"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-surface-dark">
        {loading ? (
          <div className="space-y-4 p-5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users size={40} className="mb-3 text-gray-300 dark:text-neutral-600" />
            <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">
              {search ? 'No users match your search.' : 'No users found.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400 dark:border-neutral-800 dark:text-neutral-500">
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Registered</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => handleRowClick(u.id)}
                    className="cursor-pointer border-b border-gray-50 last:border-0 transition-colors hover:bg-gray-50 dark:border-neutral-800 dark:hover:bg-white/5"
                  >
                    <td className="px-5 py-3 font-medium text-surface-ink dark:text-neutral-50">#{u.id}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {avatars[u.id] ? (
                          <img src={avatars[u.id]} alt={`${u.name}'s profile picture`} className="h-9 w-9 shrink-0 rounded-full object-cover" />
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage/20 font-semibold text-surface-ink dark:text-neutral-900">
                            {getInitials(u.name)}
                          </div>
                        )}
                        <span className="font-medium text-surface-ink dark:text-neutral-50">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 dark:text-neutral-400">{u.email || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        u.role === 'ADMIN' ? 'bg-red-50 text-red-700' :
                        u.role === 'OPTOMETRIST' ? 'bg-blue-50 text-blue-700' :
                        u.role === 'STAFF' ? 'bg-amber-50 text-amber-700' :
                        'bg-gray-50 text-gray-700'
                      }`}>
                        {getRoleLabel(u)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 dark:text-neutral-400">{formatDate(u.created_at || u.createdAt || u.date_created || u.registeredAt)}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="blue"
                          onClick={(e) => { e.stopPropagation(); handleEditOpen(u) }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={(e) => { e.stopPropagation(); setDeleting(u.id) }}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && totalPages > 1 && (
          <div className="border-t border-gray-100 px-5 py-3 dark:border-neutral-800">
            <Pagination
              currentPage={effectivePage}
              totalPages={totalPages}
              totalItems={filtered.length}
              itemsPerPage={PAGE_SIZE}
              onPageChange={setCurrentPage}
              itemLabel="users"
            />
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm dark:bg-black/70" onClick={handleEditClose} />
          <div className="relative w-full max-w-lg animate-in fade-in-0 zoom-in-95 duration-200 rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-neutral-800 dark:bg-surface-dark">
            {/* Gradient Header */}
            <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-sage to-sage-soft px-6 py-5 text-white">
              <div className="flex items-center gap-4">
                <input
                  ref={editAvatarInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/gif"
                  className="hidden"
                  onChange={handleEditAvatarChange}
                />
                <button
                  type="button"
                  onClick={() => editAvatarInputRef.current?.click()}
                  disabled={avatarUploading}
                  title="Change profile picture"
                  aria-label="Change profile picture"
                  className="group relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/20 text-xl font-bold backdrop-blur-sm transition-all duration-300 hover:bg-white/30"
                >
                  {editAvatar ? (
                    <img src={editAvatar} alt="Profile picture" className="h-14 w-14 rounded-full object-cover" />
                  ) : (
                    editing.name?.charAt(0)?.toUpperCase() || '?'
                  )}
                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {avatarUploading ? <Spinner size="sm" color="current" /> : <Camera size={16} />}
                  </span>
                </button>
                <div>
                  <h3 className="text-lg font-bold leading-tight">{editing.name}</h3>
                  <p className="text-sm opacity-80">{editing.email}</p>
                </div>
              </div>
              <div className="absolute right-4 top-4">
                <button type="button" onClick={handleEditClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors duration-300 hover:bg-white/30" aria-label="Close">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            {/* Form Body */}
            <div className="space-y-5 px-6 py-6">
              {editError && (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{editError}</div>
              )}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Full Name" icon={User} name="editName" required value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} error={errors.name} placeholder="John Doe" />
                <Field label="Email" icon={Mail} name="editEmail" type="email" required value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} error={errors.email} placeholder="john@example.com" />
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Phone" icon={Phone} name="editPhone" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} placeholder="012 345 678" />
                <Select
                  label="Role"
                  name="editRole"
                  required
                  options={ROLE_OPTIONS}
                  value={form.role}
                  onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                  error={errors.role}
                  placeholder="Select a role..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-neutral-800">
              <Button variant="ghost" onClick={handleEditClose}>Cancel</Button>
              <Button onClick={handleEditSave} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm dark:bg-black/70" onClick={handleCreateClose} />
          <div className="relative w-full max-w-lg animate-in fade-in-0 zoom-in-95 duration-200 rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-neutral-800 dark:bg-surface-dark">
            {/* Gradient Header */}
            <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-sage to-sage-soft px-6 py-5 text-white">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 text-xl font-bold backdrop-blur-sm">
                  +
                </div>
                <div>
                  <h3 className="text-lg font-bold leading-tight">Create User</h3>
                  <p className="text-sm opacity-80">Add a new user account</p>
                </div>
              </div>
              <div className="absolute right-4 top-4">
                <button type="button" onClick={handleCreateClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors duration-300 hover:bg-white/30" aria-label="Close">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            {/* Form Body */}
            <div className="space-y-5 px-6 py-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Full Name" icon={User} name="createName" required value={createForm.name} onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))} error={createErrors.name} placeholder="John Doe" />
                <Field label="Email" icon={Mail} name="createEmail" type="email" required value={createForm.email} onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))} error={createErrors.email} placeholder="john@example.com" />
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Phone" icon={Phone} name="createPhone" required value={createForm.phone} onChange={(e) => setCreateForm((prev) => ({ ...prev, phone: e.target.value }))} error={createErrors.phone} placeholder="012 345 678" />
                <Select
                  label="Role"
                  name="createRole"
                  required
                  options={ROLE_OPTIONS}
                  value={createForm.role}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, role: e.target.value }))}
                  error={createErrors.role}
                  placeholder="Select a role..."
                />
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Password" icon={Lock} name="createPassword" type="password" required value={createForm.password} onChange={(e) => setCreateForm((prev) => ({ ...prev, password: e.target.value }))} error={createErrors.password} placeholder="••••••••" helper="8-20 characters, including at least one letter and one number." />
                <Field label="Confirm Password" icon={Lock} name="createConfirmPassword" type="password" required value={createForm.confirmPassword} onChange={(e) => setCreateForm((prev) => ({ ...prev, confirmPassword: e.target.value }))} error={createErrors.confirmPassword} placeholder="••••••••" />              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-neutral-800">
              <Button variant="ghost" onClick={handleCreateClose}>Cancel</Button>
              <Button onClick={handleCreateSave} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>}>Create User</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm dark:bg-black/70" onClick={() => setDeleting(null)} />
          <div className="relative w-full max-w-sm animate-in fade-in-0 zoom-in-95 duration-200 rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-neutral-800 dark:bg-surface-dark">
            {/* Accent Header */}
            <div className="rounded-t-2xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <Trash2 size={18} />
                </div>
                <h3 className="text-base font-bold">Delete User</h3>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-surface-ink dark:text-neutral-200">{users.find((u) => u.id === deleting)?.name || 'this user'}</span>?
              </p>
              <p className="mt-1 text-xs text-gray-400 dark:text-neutral-500">This action cannot be undone.</p>
              {deleteError && (
                <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{deleteError}</div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-neutral-800">
              <Button variant="ghost" onClick={() => { setDeleting(null); setDeleteError('') }}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
