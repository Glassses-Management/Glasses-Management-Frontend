import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '@/components/ui/Avatar'
import { getAttachmentsByUser } from '@/api/attachmentApi'
import { pickImage } from '@/components/product/ProductImage'

// Circular profile picture that links to /account. Shows the uploaded photo
// when one exists, otherwise a colored initials circle like the rest of the app.
export default function ProfileAvatar({ user, size = 'size-9', onClick }) {
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    if (!user?.id) return
    let cancelled = false
    getAttachmentsByUser(user.id)
      .then((items) => {
        if (!cancelled) setAvatar(pickImage(items)?.filePath || '')
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [user?.id])

  return (
    <Link
      to="/account"
      title="My Account"
      aria-label="My Account"
      onClick={onClick}
      className="shrink-0 rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
    >
      {avatar ? (
        <img src={avatar} alt="My profile picture" className={`${size} rounded-full object-cover`} />
      ) : (
        <Avatar name={user?.name} id={user?.id} size={size} />
      )}
    </Link>
  )
}