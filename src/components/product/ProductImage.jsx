import { useState } from 'react'

// Reusable product image with a glasses fallback when there is no photo yet.
const FILE_PATH_REGEX = /\.(jpg|jpeg|png|webp|avif)([?#]|$)/i

export function pickImage(attachments) {
  const list = Array.isArray(attachments) ? attachments : []
  return (
    list.find((a) => a?.fileType?.startsWith('image/') && a?.filePath) ||
    list.find((a) => a?.filePath && FILE_PATH_REGEX.test(a.filePath)) ||
    list.find((a) => a?.filePath) ||
    null
  )
}

export function GlassesFallback({ className = '' }) {
  return (
    <svg className={className} width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="#a09a8e" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'translate(-50%,-50%)', top: '50%', left: '50%' }}>
      <circle cx="6" cy="15" r="4" />
      <circle cx="18" cy="15" r="4" />
      <path d="M14 15a2 2 0 0 0-4 0" />
      <path d="M2.5 13L5 7c.7-1.3 2-2 3.5-2h7c1.5 0 2.8.7 3.5 2l2.5 6" />
    </svg>
  )
}

function ProductImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false)
  const showFallback = !src || failed

  return (
    <div className={`relative aspect-square bg-neutral-100 dark:bg-neutral-700 ${className}`}>
      {showFallback ? (
        <GlassesFallback />
      ) : (
        <img
          src={src}
          alt={alt || ''}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  )
}

export default ProductImage
