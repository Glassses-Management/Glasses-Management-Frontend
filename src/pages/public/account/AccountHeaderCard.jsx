import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Camera, CalendarPlus, Clock } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import { useAuth } from '@/hook/UseAuth'
import { useToast } from '@/hook/UseToast'
import { getMyAttachments, uploadAttachment } from '@/api/attachmentApi'
import { pickImage } from '@/components/product/ProductImage'
import { PATIENT } from '@/pages/public/account/AccountData'

function AccountHeaderCard() {
  const { user } = useAuth()
  const { success: toastSuccess, error: toastError } = useToast()
  const fileInputRef = useRef(null)
  const [avatar, setAvatar] = useState('')
  const [uploading, setUploading] = useState(false)
  const displayName = user?.name || PATIENT.name
  const createdDate = user?.created_at || user?.createdAt
  const memberSince = createdDate
    ? new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(createdDate))
    : null

  useEffect(() => {
    if (!user?.id) return
    let cancelled = false
    getMyAttachments()
      .then((items) => {
        if (!cancelled) setAvatar(pickImage(items)?.filePath || '')
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [user?.id])

  const handlePick = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !user?.id) return
    setUploading(true)
    try {
      await uploadAttachment({ file, userId: user.id })
      toastSuccess('Profile picture updated successfully.')
      const items = await getMyAttachments()
      setAvatar(pickImage(items)?.filePath || '')
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to upload picture'
      toastError(msg)
    } finally {
      setUploading(false)
    }
  }

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#16271F]" data-aos="fade-up">
      <span className="inline-flex items-center gap-2 rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest dark:bg-leaf/10 dark:text-leaf">
        <span className="size-1.5 animate-pulse rounded-full bg-forest dark:bg-leaf" />
        Wavefront Clinical Record Synced
      </span>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {user?.id ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              title={avatar ? 'Click to change your profile picture' : 'Click to upload a profile picture'}
              aria-label="Upload profile picture"
              className="relative shrink-0 cursor-pointer rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            >
              <Avatar name={displayName} id={user.id} src={avatar} size="size-16 text-xl" />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-forest text-white ring-2 ring-white dark:ring-[#16271F]" title="Change profile picture">
                <Camera size={12} />
              </span>
            </button>
          ) : (
            <Avatar name={displayName} id={1} src={avatar} size="size-16 text-xl" />
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/gif"
            className="hidden"
            onChange={handlePick}
          />
          <div className="min-w-0">
            <h2 className="truncate font-sans text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
              {displayName}
            </h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {user ? 'Primary Care Patient' : PATIENT.accountType} · Assigned to {PATIENT.doctor} · Member since {user ? (memberSince || '—') : PATIENT.memberSince}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <Link
            to="/request"
            className="inline-flex items-center gap-2 rounded-lg border border-forest px-4 py-2 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-white dark:border-leaf dark:text-leaf dark:hover:bg-leaf dark:hover:text-forest"
          >
            <CalendarPlus size={16} />
            Book Follow-up Exam
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-neutral-500 ring-1 ring-neutral-200 dark:bg-white/5 dark:text-neutral-400 dark:ring-neutral-700">
            <Clock size={12} />
            Offline for {PATIENT.offlineDays} Days
          </span>
          <Link to="/contact" className="text-xs font-semibold text-forest hover:underline dark:text-leaf">
            Update availability
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AccountHeaderCard