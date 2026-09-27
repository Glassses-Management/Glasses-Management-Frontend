import { useEffect, useState } from 'react'
import { getMyAttachments } from '@/api/attachmentApi'
import { pickImage } from '@/components/product/ProductImage'

// Loads the signed-in user's profile picture url. Returns '' when the user has
// no picture, has no id yet, or the request fails, so callers can fall back to
// an initials circle.
export function useUserAvatar(userId) {
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    if (!userId) return undefined
    let cancelled = false
    getMyAttachments(userId)
      .then((items) => {
        if (!cancelled) setAvatar(pickImage(items)?.filePath || '')
      })
      .catch(() => {
        if (!cancelled) setAvatar('')
      })
    return () => {
      cancelled = true
    }
  }, [userId])

  return userId ? avatar : ''
}
