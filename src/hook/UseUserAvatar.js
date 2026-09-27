import { useEffect, useState } from 'react'
import { getMyAttachments } from '@/api/attachmentApi'
import { pickImage } from '@/components/product/ProductImage'

// Loads the signed-in user's profile picture url. Returns '' when the user has
// no picture or the request fails, so callers can fall back to an initials
// circle. The id is not needed: /attachments/mine resolves the owner from the JWT.
export function useUserAvatar() {
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    let cancelled = false
    getMyAttachments()
      .then((items) => {
        if (!cancelled) setAvatar(pickImage(items)?.filePath || '')
      })
      .catch(() => {
        if (!cancelled) setAvatar('')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return avatar
}
