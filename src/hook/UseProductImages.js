import { useEffect, useMemo, useState } from 'react'
import { getAttachmentsByProduct } from '@/api/attachmentApi'
import { pickImage } from '@/components/product/ProductImage'

// Loads one image url per product id and returns a { [productId]: filePath } map.
//
// Products have no image column (ProductResponse - API_DOCUMENT.md section 8);
// pictures are separate attachment records, so every product needs its own
// lookup.
//
// Results accumulate in state for the life of the page, so paging a table back
// to rows already seen does not refetch them. State is discarded on unmount, so
// a picture can never go stale.
export function useProductImages(productIds) {
  const [images, setImages] = useState({})

  // Sorted into a stable string, so a new array holding the same ids does not
  // retrigger the effect on every render.
  const key = [...new Set((productIds || []).filter((id) => id != null))]
    .sort((a, b) => a - b)
    .join(',')

  useEffect(() => {
    if (!key) return

    // Only look up what is not cached yet. Once every id is present this is
    // empty and the effect stops, so including images below cannot loop.
    const missing = key.split(',').map(Number).filter((id) => !(id in images))
    if (missing.length === 0) return

    let cancelled = false

    const load = async () => {
      const pairs = await Promise.all(
        missing.map(async (id) => {
          const attachments = await getAttachmentsByProduct(id).catch(() => [])
          return [id, pickImage(attachments)?.filePath || '']
        }),
      )
      if (cancelled) return
      setImages((prev) => ({ ...prev, ...Object.fromEntries(pairs) }))
    }

    void load()
    return () => { cancelled = true }
  }, [key, images])

  // Only hand back the ids currently on screen, so a picture cached from an
  // earlier page can never be shown against the wrong product.
  return useMemo(() => {
    const wanted = key ? key.split(',').map(Number) : []
    const result = {}
    for (const id of wanted) {
      if (id in images) result[id] = images[id]
    }
    return result
  }, [images, key])
}
