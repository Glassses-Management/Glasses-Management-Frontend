import { useEffect, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { useToast } from '@/hook/UseToast'
import { getAttachmentsByUser, deleteAttachment } from '@/api/attachmentApi'
import { pickImage } from '@/components/product/ProductImage'
import AttachmentUploader from '@/components/uploads/AttachmentUploader'

export default function AvatarUploadSection({ userId, name }) {
  const { success: toastSuccess, error: toastError } = useToast()
  const [avatar, setAvatar] = useState('')
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

  const handleUploaded = async () => {
    toastSuccess('Profile picture updated successfully.')
    await loadAvatar()
  }

  const confirmRemove = async () => {
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
      <AttachmentUploader
        shape="circle"
        hideLabel
        userId={userId}
        currentImage={avatar}
        accept="image/png,image/jpeg,image/gif"
        onUploaded={handleUploaded}
        onRemove={() => setRemoveOpen(true)}
        placeholder={
          <span className="block">
            <Avatar name={name} id={userId} size="size-16 text-lg" />
          </span>
        }
      />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#1a1a2e] dark:text-neutral-100">{name || 'My Profile'}</p>
        <p className="mt-1 text-xs text-gray-400 dark:text-neutral-500">
          Click your picture to upload or change it (PNGs, JPEGs and GIFs under 10MB)
        </p>
      </div>

      {removeOpen && (
        <Modal
          open
          onClose={() => setRemoveOpen(false)}
          title="Remove Profile Picture"
          footer={
            <div className="flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={() => setRemoveOpen(false)}>Cancel</Button>
              <Button variant="danger" loading={saving} onClick={confirmRemove}>Remove</Button>
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
