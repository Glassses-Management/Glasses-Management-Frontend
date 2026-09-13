import { useEffect, useRef, useState } from 'react'
import { Trash2 } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { useToast } from '@/hook/UseToast'
import { getAttachmentsByUser, uploadAttachment, deleteAttachment } from '@/api/attachmentApi'
import { pickImage } from '@/components/product/ProductImage'

export default function AvatarUploadSection({ userId, name }) {
  const { success: toastSuccess, error: toastError } = useToast()
  const fileInputRef = useRef(null)
  const [avatar, setAvatar] = useState('')
  const [pending, setPending] = useState(null)
  const [preview, setPreview] = useState('')
  const [saving, setSaving] = useState(false)
  const [removeOpen, setRemoveOpen] = useState(false)

  const loadAvatar = async () => {
    if (!userId) return
    try {
      const items = await getAttachmentsByUser(userId)
      setAvatar(pickImage(items)?.filePath || '')
    } catch (err) {
      console.error('AvatarUploadSection: failed to load avatar:', err?.response?.status || err?.message || err)
    }
  }

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    getAttachmentsByUser(userId)
      .then((items) => {
        if (!cancelled) setAvatar(pickImage(items)?.filePath || '')
      })
      .catch((err) => {
        if (!cancelled) console.error('AvatarUploadSection: failed to load avatar:', err?.response?.status || err?.message || err)
      })
    return () => { cancelled = true }
  }, [userId])

  const pickFile = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setPending(file)
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const cancelUpload = () => {
    setPending(null)
    setPreview('')
  }

  const confirmUpload = async () => {
    if (!pending) return
    setSaving(true)
    try {
      await uploadAttachment({ file: pending, userId })
      toastSuccess('Profile picture updated successfully.')
      cancelUpload()
      await loadAvatar()
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to upload picture'
      toastError(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async () => {
    if (!avatar) return
    setSaving(true)
    try {
      const items = await getAttachmentsByUser(userId)
      const pick = pickImage(items)
      if (pick?.id) await deleteAttachment(pick.id)
      toastSuccess('Profile picture removed.')
      await loadAvatar()
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to remove picture'
      toastError(msg)
    } finally {
      setSaving(false)
      setRemoveOpen(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        title={avatar ? 'Click to change your profile picture' : 'Click to upload a profile picture'}
        aria-label="Upload profile picture"
        className="shrink-0 cursor-pointer rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
      >
        {avatar ? (
          <img src={avatar} alt="Profile picture" className="size-16 rounded-full object-cover" />
        ) : (
          <span className="block">
            <Avatar name={name} id={userId} size="size-16 text-lg" />
          </span>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#1a1a2e] dark:text-neutral-100">{name || 'My Profile'}</p>
        <p className="mt-1 text-xs text-gray-400 dark:text-neutral-500">
          Click your picture to upload or change it (PNGs, JPEGs and GIFs under 10MB)
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif"
          className="hidden"
          onChange={pickFile}
        />
        <Button
          variant="danger"
          icon={<Trash2 size={15} />}
          onClick={() => setRemoveOpen(true)}
          disabled={!avatar}
          className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-red-500/25 active:translate-y-0"
        >
          Remove
        </Button>
      </div>

      {pending && (
        <Modal
          open
          onClose={cancelUpload}
          title="Confirm Profile Picture"
          footer={
            <div className="flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={cancelUpload}>Cancel</Button>
              <Button loading={saving} onClick={confirmUpload}>Save Picture</Button>
            </div>
          }
        >
          <img src={preview} alt="New profile preview" className="mx-auto size-24 rounded-full object-cover" />
          <p className="mt-4 text-center text-sm text-gray-400 dark:text-neutral-500">
            {pending.name} · {(pending.size / 1024).toFixed(1)} KB
          </p>
        </Modal>
      )}

      {removeOpen && (
        <Modal
          open
          onClose={() => setRemoveOpen(false)}
          title="Remove Profile Picture"
          footer={
            <div className="flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={() => setRemoveOpen(false)}>Cancel</Button>
              <Button variant="danger" loading={saving} onClick={handleRemove}>Remove</Button>
            </div>
          }
        >
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            This will permanently delete your profile picture. You can upload a new one anytime.
          </p>
        </Modal>
      )}
    </div>
  )
}